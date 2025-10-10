"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationFormData, LocationSchemaForCreate } from "@/lib/validators/locationSchema";
import { useState, useEffect } from "react";
import { createLocation, createProductLocationLink, deleteLocation, deleteProductLocationLink } from "@/services/location.api";
import { getAllProducts } from "@/services/product.api";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const Page = () => {

    interface Tree {
        id: number;
        name: string;
    }

    const [arbresDisponibles, setArbresDisponibles] = useState<Tree[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTrees, setSelectedTrees] = useState<string[]>([]);
    const [tempSelection, setTempSelection] = useState<string[]>([]);
    const [locations, setLocations] = useState<any[]>([]);

    useEffect(() => {
        const fetchTrees = async () => {
            try {
                const allTrees = await getAllProducts();
                allTrees.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setArbresDisponibles(allTrees);
            } catch (err) {
                console.error("Erreur en récupérant les arbres :", err);
            }
        };
        fetchTrees();
    }, []);

    // --- react-hook-form ---
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(LocationSchemaForCreate),
    });

    const handleOpen = () => {
        setTempSelection(selectedTrees);
        setIsOpen(true);
    };

    const handleClose = () => setIsOpen(false);

    const handleConfirm = () => {
        setSelectedTrees(tempSelection);
        setIsOpen(false);
    };

    const toggleCheckbox = (arbre: string) => {
        if (tempSelection.includes(arbre)) {
            setTempSelection(tempSelection.filter((t) => t !== arbre));
        } else {
            setTempSelection([...tempSelection, arbre]);
        }
    };

    const onSubmit = async (data: LocationFormData) => {
        try {
            const newLoc = await createLocation({
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
            });

            await Promise.all(
                selectedTrees.map(async (treeName) => {
                    const tree = arbresDisponibles.find((t) => t.name === treeName);
                    if (tree) {
                        await createProductLocationLink(newLoc.id.toString(), { product_id: tree.id });
                    }
                })
            );

            setLocations((prev) => [
                ...prev,
                {
                    id: newLoc.id,
                    name: newLoc.name,
                    latitude: newLoc.latitude,
                    longitude: newLoc.longitude,
                    trees: selectedTrees,
                },
            ]);

            reset();
            setSelectedTrees([]);
            setTempSelection([]);
        } catch (err) {
            console.error("Erreur lors de la création ❌", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const locToDelete = locations.find((loc) => loc.id === id);
            if (!locToDelete) return;

            if (locToDelete.trees && locToDelete.trees.length > 0) {
                await Promise.all(
                    locToDelete.trees.map(async (treeName: string) => {
                        const tree = arbresDisponibles.find((t) => t.name === treeName);
                        if (tree) await deleteProductLocationLink(id, tree.id);
                    })
                );
            }

            await deleteLocation(id);
            setLocations((prev) => prev.filter((loc) => loc.id !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression ❌", err);
        }
    };

    return (
        <main className="min-h-screen mt-16 px-4 custom-size-minmax">
            <nav aria-label="breadcrumb" className="mb-6 flex items-center text-sm text-gray-600">
                <Link href="/admin" className="flex items-center gap-1 hover:underline">
                    <FaChevronLeft /> Admin
                </Link>
                <span className="mx-2">/</span>
                <Link href="/admin/localisations" className="hover:underline">
                    Localisations
                </Link>
                <span className="mx-2">/</span>
                <span aria-current="page" className="font-medium text-green-700">
                    Créer une localisation
                </span>
            </nav>

            <section>
                <div className="space-y-4 md:space-y-6 bg-brand-white rounded-xl p-6 border border-brand-lightgreen/20 mt-10">
                    <h2 className="text-lg font-semibold text-brand-darkgreen">Ajouter et Associer une ou plusieurs localisations</h2>

                    <div className="grid grid-cols-8 gap-4">
                        <h3 className="col-span-3 block text-brand-darkgreen font-medium mb-1 md:mb-2 text-xs md:text-sm">Nouvelle localisation</h3>
                        <p className="text-center text-brand-darkgreen font-medium text-sm">Latitude</p>
                        <p className="text-center text-brand-darkgreen font-medium text-sm">Longitude</p>
                        <p className="col-span-2 text-center text-brand-darkgreen font-medium text-sm">Arbre(s) associé(s)<sup>(optionnel)</sup></p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-8 gap-4 mb-14">

                        {/* Nom */}
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Nom de la localisation"
                                {...register("name")}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-green"
                            />
                            {/* <p className="text-gray-500 text-xs mt-1">Entrez un nom descriptif, sans chiffres ni caractères spéciaux.</p> */}
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Latitude */}
                        <div>
                            <input
                                // Le type number permet active la validation native du navigateur, cependant la validation vient de Zod ici, donc le type text est favorisé pour avoir les erreurs de Zod
                                type="text"
                                // affiche le clavier numérique sur mobile ex : 41.40338
                                inputMode="decimal"
                                placeholder="Exemple : 41.40338"
                                {...register("latitude")}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-green"
                            />
                            {/* <p className="text-gray-500 text-xs mt-1">Latitude comprise entre -90 et 90.</p> */}
                            {errors.latitude && <p className="text-red-600 text-xs mt-1">{errors.latitude.message}</p>}
                        </div>

                        {/* Longitude */}
                        <div>
                            <input
                                // Le type number permet active la validation native du navigateur, cependant la validation vient de Zod ici, donc le type text est favorisé pour avoir les erreurs de Zod
                                type="text"
                                // affiche le clavier numérique sur mobile ex : 2.17403
                                inputMode="decimal"
                                placeholder="Exemple : 2.17403"
                                {...register("longitude")}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-green"
                            />
                            {/* <p className="text-gray-500 text-xs mt-1">Longitude comprise entre -180 et 180.</p> */}
                            {errors.longitude && <p className="text-red-600 text-xs mt-1">{errors.longitude.message}</p>}
                        </div>

                        {/* Arbres associés */}
                        <div className="flex w-full col-span-2 pr-4">
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="px-4 mr-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Choisir
                            </button>

                            {selectedTrees.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedTrees.map((tree, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                        >
                                            {tree}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {isOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                                        <h2 className="text-lg font-semibold mb-4">Sélectionne des arbres</h2>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {arbresDisponibles.map((arbre, index) => (
                                                <label key={arbre.id ?? index} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempSelection.includes(arbre.name)}
                                                        onChange={() => toggleCheckbox(arbre.name)}
                                                        className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                                    />
                                                    <span>{arbre.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end gap-3">
                                            <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Annuler</button>
                                            <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Valider</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer col-start-8 bg-brand-green hover:bg-brand-lightgreen text-white px-4 py-2 rounded-lg"
                        >
                            Ajouter & associer
                        </button>
                    </form>

                    {/* Localisations ajoutées */}
                    {locations.length > 0 && (
                        <>
                            <div className="grid grid-cols-8 gap-4">
                                <h3 className="col-span-3 block text-brand-darkgreen font-medium mb-1 md:mb-2 text-xs md:text-sm">
                                    Localisations ajoutées
                                </h3>
                                <p className="text-center text-brand-darkgreen font-medium text-sm">Latitude</p>
                                <p className="text-center text-brand-darkgreen font-medium text-sm">Longitude</p>
                            </div>

                            {locations.map((loc, index) => (
                                <form key={index} className="grid grid-cols-8 gap-4">
                                    <p className="col-span-3 w-full flex items-center pl-3">{loc.name}</p>
                                    <p className="w-full flex items-center justify-center">{loc.latitude}</p>
                                    <p className="w-full flex items-center justify-center">{loc.longitude}</p>
                                    <div className="col-span-2 w-full flex flex-wrap items-center justify-start gap-2">
                                        {(loc.trees || []).map((tree: string, i: number) => (
                                            <p key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{tree}</p>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(loc.id)}
                                        className="cursor-pointer col-start-8 bg-brand-warning hover:bg-red-800 text-white px-4 py-2 rounded-lg"
                                    >
                                        Supprimer
                                    </button>
                                </form>
                            ))}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Page;

