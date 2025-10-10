// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { FaChevronLeft } from "react-icons/fa";

// import { getAllProducts } from "@/services/product.api";
// import {
//     getAllLocationsWithRelations,
//     updateLocation,
//     deleteProductLocationLink,
//     createProductLocationLink,
// } from "@/services/location.api";

// const Page = () => {
//     const router = useRouter();
//     const { id } = useParams();

//     interface Tree {
//         id: number;
//         name: string;
//     }

//     const [location, setLocation] = useState<any>(null);
//     const [arbresDisponibles, setArbresDisponibles] = useState<Tree[]>([]);
//     const [selectedTrees, setSelectedTrees] = useState<string[]>([]);
//     const [tempSelection, setTempSelection] = useState<string[]>([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // Champs modifiables
//     const [name, setName] = useState("");
//     const [latitude, setLatitude] = useState("");
//     const [longitude, setLongitude] = useState("");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const allTrees = await getAllProducts();
//                 allTrees.sort((a: any, b: any) => a.name.localeCompare(b.name));
//                 setArbresDisponibles(allTrees);

//                 const allLocations = await getAllLocationsWithRelations();
//                 console.log(allLocations)
//                 const loc = allLocations.find((l: any) => l.id.toString() === id);

//                 if (loc) {
//                     setLocation(loc);
//                     setName(loc.name);
//                     setLatitude(loc.latitude.toString());
//                     setLongitude(loc.longitude.toString());

//                     // Extraction des produits liés via productLocations
//                     const linkedTrees =
//                         loc.productLocations?.map((pl: any) => pl.product?.name) || [];
//                     setSelectedTrees(linkedTrees);
//                 }
//             } catch (err) {
//                 console.error("Erreur lors du chargement des données ❌", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     /*** --- MODALE --- ***/
//     const handleOpen = () => {
//         setTempSelection(selectedTrees);
//         setIsOpen(true);
//     };

//     const handleClose = () => setIsOpen(false);

//     const handleConfirm = () => {
//         setSelectedTrees(tempSelection);
//         setIsOpen(false);
//     };

//     const toggleCheckbox = (tree: string) => {
//         if (tempSelection.includes(tree)) {
//             setTempSelection(tempSelection.filter((t) => t !== tree));
//         } else {
//             setTempSelection([...tempSelection, tree]);
//         }
//     };

//     /*** --- SAUVEGARDE --- ***/
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!location) return;

//         try {
//             // 1️⃣ Mettre à jour la localisation
//             await updateLocation(location.id.toString(), {
//                 name,
//                 latitude: parseFloat(latitude),
//                 longitude: parseFloat(longitude),
//             });

//             // 2️⃣ Mettre à jour les liaisons arbre ↔ localisation
//             const oldTrees =
//                 location.productLocations?.map((pl: any) => pl.product?.name) || [];
//             const toAdd = selectedTrees.filter((tree) => !oldTrees.includes(tree));
//             const toRemove = oldTrees.filter((tree: string) => !selectedTrees.includes(tree));

//             // Ajout des nouveaux liens
//             for (const treeName of toAdd) {
//                 const tree = arbresDisponibles.find((t) => t.name === treeName);
//                 if (tree) {
//                     await createProductLocationLink(location.id.toString(), {
//                         product_id: tree.id,
//                     });
//                 }
//             }

//             // Suppression des liens retirés
//             for (const treeName of toRemove) {
//                 const tree = arbresDisponibles.find((t) => t.name === treeName);
//                 if (tree) {
//                     await deleteProductLocationLink(location.id.toString(), tree.id);
//                 }
//             }

//             alert("Localisation mise à jour avec succès ✅");
//             router.push("/admin/localisations");
//         } catch (err) {
//             console.error("Erreur lors de la mise à jour ❌", err);
//             alert("Erreur lors de la mise à jour");
//         }
//     };

//     if (loading)
//         return <p className="p-10 text-center text-gray-500">Chargement...</p>;
//     if (!location)
//         return (
//             <p className="p-10 text-center text-red-500">Localisation introuvable.</p>
//         );

//     return (
//         <main className="min-h-screen mt-16 px-4 custom-size-minmax">
//             <nav
//                 aria-label="breadcrumb"
//                 className="mb-6 flex items-center text-sm text-gray-600"
//             >
//                 <Link href="/admin" className="flex items-center gap-1 hover:underline">
//                     <FaChevronLeft /> Admin
//                 </Link>
//                 <span className="mx-2">/</span>
//                 <Link href="/admin/localisations" className="hover:underline">
//                     Localisations
//                 </Link>
//                 <span className="mx-2">/</span>
//                 <span aria-current="page" className="font-medium text-green-700">
//                     Modifier une localisation
//                 </span>
//             </nav>

//             <section>
//                 <div className="space-y-4 md:space-y-6 bg-brand-white rounded-xl p-6 border border-brand-lightgreen/20 mt-10">
//                     <h2 className="text-lg font-semibold text-brand-darkgreen">
//                         Modifier la localisation et ses arbres associés
//                     </h2>
//                     <div className="grid grid-cols-8 gap-4">
//                         <h3 className="col-span-3 block text-brand-darkgreen font-medium mb-1 md:mb-2 text-xs md:text-sm">Localisation</h3>
//                         <p className="text-center text-brand-darkgreen font-medium text-sm">Latitude</p>
//                         <p className="text-center text-brand-darkgreen font-medium text-sm">Longitude</p>
//                         <p className="col-span-2 text-center text-brand-darkgreen font-medium text-sm">Arbre(s) associé(s)<sup>(optionnel)</sup></p>
//                     </div>
//                     <form
//                         onSubmit={handleSubmit}
//                         className="grid grid-cols-8 gap-4 mb-14"
//                     >
//                         {/* Nom */}
//                         <input
//                             type="text"
//                             placeholder="Nom de la localisation"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="col-span-3 w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
//                         />

//                         {/* Latitude */}
//                         <input
//                             type="number"
//                             placeholder="Latitude"
//                             value={latitude}
//                             onChange={(e) => setLatitude(e.target.value)}
//                             className="w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
//                         />

//                         {/* Longitude */}
//                         <input
//                             type="number"
//                             placeholder="Longitude"
//                             value={longitude}
//                             onChange={(e) => setLongitude(e.target.value)}
//                             className="w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
//                         />

//                         {/* Choix arbres */}
//                         <div className="flex w-full col-span-2 pr-4">
//                             <button
//                                 type="button"
//                                 onClick={handleOpen}
//                                 className="px-4 mr-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                             >
//                                 Choisir
//                             </button>

//                             {/* Arbres affichés directement */}
//                             {selectedTrees.length > 0 && (
//                                 <div className="flex flex-wrap items-center gap-2">
//                                     {selectedTrees.map((tree, index) => (
//                                         <span
//                                             key={index}
//                                             className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
//                                         >
//                                             {tree}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Modale de sélection */}
//                             {isOpen && (
//                                 <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//                                     <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
//                                         <h2 className="text-lg font-semibold mb-4">
//                                             Modifier les arbres associés
//                                         </h2>

//                                         <div className="space-y-2 max-h-60 overflow-y-auto">
//                                             {arbresDisponibles.map((arbre) => (
//                                                 <label
//                                                     key={arbre.id}
//                                                     className="flex items-center space-x-2 cursor-pointer"
//                                                 >
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={tempSelection.includes(arbre.name)}
//                                                         onChange={() => toggleCheckbox(arbre.name)}
//                                                         className="h-4 w-4 text-green-600 border-gray-300 rounded"
//                                                     />
//                                                     <span>{arbre.name}</span>
//                                                 </label>
//                                             ))}
//                                         </div>

//                                         <div className="mt-4 flex justify-end gap-3">
//                                             <button
//                                                 type="button"
//                                                 onClick={handleClose}
//                                                 className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                                             >
//                                                 Annuler
//                                             </button>
//                                             <button
//                                                 type="button"
//                                                 onClick={handleConfirm}
//                                                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                                             >
//                                                 Valider
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Bouton Enregistrer */}
//                         <button
//                             type="submit"
//                             className="cursor-pointer col-start-8 bg-brand-green hover:bg-brand-lightgreen text-white px-4 py-2 rounded-lg"
//                         >
//                             Modifier
//                         </button>
//                     </form>
//                 </div>
//             </section>
//         </main>
//     );
// };

// export default Page;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

import { getAllProducts } from "@/services/product.api";
import {
    getAllLocationsWithRelations,
    updateLocation,
    deleteProductLocationLink,
    createProductLocationLink,
} from "@/services/location.api";

import { LocationSchemaForCreate } from "@/lib/validators/locationSchema"; // ✅ import du schéma Zod

const Page = () => {
    const router = useRouter();
    const { id } = useParams();

    interface Tree {
        id: number;
        name: string;
    }

    const [location, setLocation] = useState<any>(null);
    const [arbresDisponibles, setArbresDisponibles] = useState<Tree[]>([]);
    const [selectedTrees, setSelectedTrees] = useState<string[]>([]);
    const [tempSelection, setTempSelection] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Champs modifiables
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // ✅ Gestion des erreurs de validation
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allTrees = await getAllProducts();
                allTrees.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setArbresDisponibles(allTrees);

                const allLocations = await getAllLocationsWithRelations();
                const loc = allLocations.find((l: any) => l.id.toString() === id);

                if (loc) {
                    setLocation(loc);
                    setName(loc.name);
                    setLatitude(loc.latitude.toString());
                    setLongitude(loc.longitude.toString());

                    // Extraction des produits liés via productLocations
                    const linkedTrees =
                        loc.productLocations?.map((pl: any) => pl.product?.name) || [];
                    setSelectedTrees(linkedTrees);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données ❌", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /*** --- MODALE --- ***/
    const handleOpen = () => {
        setTempSelection(selectedTrees);
        setIsOpen(true);
    };

    const handleClose = () => setIsOpen(false);

    const handleConfirm = () => {
        setSelectedTrees(tempSelection);
        setIsOpen(false);
    };

    const toggleCheckbox = (tree: string) => {
        if (tempSelection.includes(tree)) {
            setTempSelection(tempSelection.filter((t) => t !== tree));
        } else {
            setTempSelection([...tempSelection, tree]);
        }
    };

    /*** --- SAUVEGARDE AVEC VALIDATION ZOD --- ***/
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) return;

        // ✅ Validation avec Zod
        const validation = LocationSchemaForCreate.safeParse({
            name,
            latitude,
            longitude,
        });

        if (!validation.success) {
            const { fieldErrors } = validation.error.flatten();
            const errors: Record<string, string> = {};

            if (fieldErrors.name?.[0]) errors.name = fieldErrors.name[0];
            if (fieldErrors.latitude?.[0]) errors.latitude = fieldErrors.latitude[0];
            if (fieldErrors.longitude?.[0]) errors.longitude = fieldErrors.longitude[0];

            setFormErrors(errors);
            return;
        }

        // Si tout est valide
        setFormErrors({});
        const validatedData = validation.data;

        try {
            // 1️⃣ Mettre à jour la localisation
            await updateLocation(location.id.toString(), validatedData);

            // 2️⃣ Mettre à jour les associations arbres ↔ localisation
            const oldTrees =
                location.productLocations?.map((pl: any) => pl.product?.name) || [];
            const toAdd = selectedTrees.filter((tree) => !oldTrees.includes(tree));
            const toRemove = oldTrees.filter(
                (tree: string) => !selectedTrees.includes(tree)
            );

            // Ajouts
            for (const treeName of toAdd) {
                const tree = arbresDisponibles.find((t) => t.name === treeName);
                if (tree) {
                    await createProductLocationLink(location.id.toString(), {
                        product_id: tree.id,
                    });
                }
            }

            // Suppressions
            for (const treeName of toRemove) {
                const tree = arbresDisponibles.find((t) => t.name === treeName);
                if (tree) {
                    await deleteProductLocationLink(location.id.toString(), tree.id);
                }
            }

            alert("Localisation mise à jour avec succès ✅");
            router.push("/admin/localisations");
        } catch (err) {
            console.error("Erreur lors de la mise à jour ❌", err);
            alert("Erreur lors de la mise à jour");
        }
    };

    if (loading)
        return <p className="p-10 text-center text-gray-500">Chargement...</p>;
    if (!location)
        return (
            <p className="p-10 text-center text-red-500">
                Localisation introuvable.
            </p>
        );

    return (
        <main className="min-h-screen mt-16 px-4 custom-size-minmax">
            <nav
                aria-label="breadcrumb"
                className="mb-6 flex items-center text-sm text-gray-600"
            >
                <Link href="/admin" className="flex items-center gap-1 hover:underline">
                    <FaChevronLeft /> Admin
                </Link>
                <span className="mx-2">/</span>
                <Link href="/admin/localisations" className="hover:underline">
                    Localisations
                </Link>
                <span className="mx-2">/</span>
                <span aria-current="page" className="font-medium text-green-700">
                    Modifier une localisation
                </span>
            </nav>

            <section>
                <div className="space-y-4 md:space-y-6 bg-brand-white rounded-xl p-6 border border-brand-lightgreen/20 mt-10">
                    <h2 className="text-lg font-semibold text-brand-darkgreen">
                        Modifier la localisation et ses arbres associés
                    </h2>

                    <div className="grid grid-cols-8 gap-4">
                        <h3 className="col-span-3 block text-brand-darkgreen font-medium mb-1 md:mb-2 text-xs md:text-sm">
                            Localisation
                        </h3>
                        <p className="text-center text-brand-darkgreen font-medium text-sm">
                            Latitude
                        </p>
                        <p className="text-center text-brand-darkgreen font-medium text-sm">
                            Longitude
                        </p>
                        <p className="col-span-2 text-center text-brand-darkgreen font-medium text-sm">
                            Arbre(s) associé(s)<sup>(optionnel)</sup>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-8 gap-4 mb-14">
                        {/* Nom */}
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Nom de la localisation"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
                            />
                            {formErrors.name && (
                                <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* Latitude */}
                        <div>
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
                            />
                            {formErrors.latitude && (
                                <p className="text-red-600 text-xs mt-1">{formErrors.latitude}</p>
                            )}
                        </div>

                        {/* Longitude */}
                        <div>
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="w-full px-3 py-2 border border-brand-lightgreen/20 rounded-lg bg-white text-sm focus:ring-1 focus:ring-brand-green"
                            />
                            {formErrors.longitude && (
                                <p className="text-red-600 text-xs mt-1">{formErrors.longitude}</p>
                            )}
                        </div>

                        {/* Choix arbres */}
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
                                        <h2 className="text-lg font-semibold mb-4">
                                            Modifier les arbres associés
                                        </h2>

                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {arbresDisponibles.map((arbre) => (
                                                <label
                                                    key={arbre.id}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
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
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirm}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bouton Enregistrer */}
                        <button
                            type="submit"
                            className="cursor-pointer col-start-8 bg-brand-green hover:bg-brand-lightgreen text-white px-4 py-2 rounded-lg"
                        >
                            Modifier
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Page;
