"use client";

import { useState } from "react";
import { FaRegEye, FaChevronLeft } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineCreate } from "react-icons/md";
import { LuListFilter } from "react-icons/lu";
import { PiTreeFill, PiMagnifyingGlassBold } from "react-icons/pi";
import { TbMapOff, TbChristmasTreeOff, TbMapPin2 } from "react-icons/tb";
import Link from "next/link";
import { useLocations } from "@/hook/useLocations";
import { deleteLocation, deleteProductLocationLink, getAllLocationsWithRelations } from "@/services/location.api";
import { ILocation } from "@/types/index.types"
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

const Page = () => {
    const { locations, pagination, loading, fetchData } = useLocations(10);

    const [showModal, setShowModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleDeleteClick = (loc: ILocation) => {
        setSelectedLocation(loc);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedLocation) return;

        try {
            // 1️⃣ Récupérer les relations pour la localisation
            const locWithRelations = await getAllLocationsWithRelations();
            const locationData = locWithRelations.find((l: any) => Number(l.id) === selectedLocation.id);

            if (locationData?.productLocations) {
                for (const pl of locationData.productLocations) {
                    await deleteProductLocationLink(selectedLocation.id.toString(), pl.product_id);
                }
            }

            // 2️⃣ Supprimer la localisation
            await deleteLocation(selectedLocation.id.toString());

            // 3️⃣ Mettre à jour le tableau
            fetchData(pagination.page, pagination.limit);

            // 4️⃣ Message temporaire
            setSuccessMessage(`La localisation "${selectedLocation.name}" a bien été supprimée.`);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
            alert("Erreur lors de la suppression de la localisation ❌");
        } finally {
            setShowModal(false);
            setSelectedLocation(null);
        }
    };

    return (
        <main className="min-h-screen mt-16 px-4 custom-size-minmax">
            <SecondaryNav />
            <section>

                <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">Vue d'ensemble des Localisations</h1>

                <div className="flex justify-center items-between gap-8">
                    <div className="mt-10 h-53 w-80 bg-brand-white rounded-xl p-6 border border-brand-lightgreen/30 shadow-sm text-center">
                        <p className="font-extrabold text-brand-green text-4xl mb-3">
                            42
                        </p>
                        <h3 className="text-base font-semibold text-brand-darkgreen mb-2">
                            Total des lieux de plantation
                        </h3>
                        <div className="bg-brand-lightgreen/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                            <PiTreeFill className="text-xl md:text-2xl text-brand-darkgreen" />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-extrabold text-brand-green text-2xl text-center mb-2">Etat des lieux de plantations</h2>
                        <div className="flex gap-4">
                            <div className="w-60  bg-brand-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-brand-lightgreen/30 shadow-sm text-center">
                                <p className="font-extrabold text-brand-green text-4xl mb-3">
                                    38
                                </p>
                                <h3 className="text-base font-semibold text-brand-darkgreen mb-2">
                                    Arbres ayant une zone de plantation
                                </h3>
                                <div className="bg-brand-lightgreen/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                    <TbMapPin2 className="text-xl md:text-2xl text-brand-lightgreen" />
                                </div>
                            </div>
                            <div className="w-60 bg-orange-300/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-300 shadow-sm text-center">
                                <p className="font-extrabold text-orange-400 text-4xl mb-3">
                                    1
                                </p>
                                <h3 className="text-base font-semibold text-orange-600 mb-2">
                                    Localisation sans arbre associé
                                </h3>
                                <div className="bg-orange-600/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                    <TbChristmasTreeOff className="text-xl md:text-2xl text-orange-600" />
                                </div>
                            </div>
                            <div className="w-60 bg-red-300/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-red-300 shadow-sm text-center">
                                <p className="font-extrabold text-red-400 text-4xl mb-3">
                                    3
                                </p>
                                <h3 className="text-base font-semibold text-red-600 mb-2">
                                    Arbres sans une zone de plantation
                                </h3>
                                <div className="bg-red-600/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                    <TbMapOff className="text-xl md:text-2xl text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            <section className="pb-10">
                <div className="flex justify-between my-10">
                    <div className="flex  border border-gray-300 rounded-full overflow-hidden w-full md:w-1/2 cursor-pointer">
                        <input
                            type="text"
                            placeholder="Rechercher un une localisation par son nom"
                            className="flex-1 px-4 py-2 outline-none"
                        />
                        <button className="bg-brand-green text-white px-4 hover:bg-brand-darkgreen cursor-pointer">
                            <PiMagnifyingGlassBold />
                        </button>
                    </div>
                    <Link href={"/admin/localisations/creation"} className="flex items-center px-8 border border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
                        <MdOutlineCreate className="mr-4" />
                        <p>Ajouter une localisation</p>
                    </Link>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded">
                        {successMessage}
                    </div>
                )}

                <table className="border-collapse border border-brand-darkgreen w-full">
                    <thead>
                        <tr className="h-14">
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen">Id</th>
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen">
                                <div className="flex justify-center items-center h-14">
                                    Nom
                                    <LuListFilter className="ml-5" />
                                </div>
                            </th>
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen">
                                <div className="flex justify-center items-center h-14">
                                    Latitude
                                    <LuListFilter className="ml-5" />
                                </div>
                            </th>
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen">
                                <div className="flex justify-center items-center h-14">
                                    Longitude
                                    <LuListFilter className="ml-5" />
                                </div>
                            </th>
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen">
                                <div className="flex justify-center items-center h-14">
                                    Nb Arbres associés
                                    <LuListFilter className="ml-5" />
                                </div>
                            </th>
                            <th scope="col" className="border-x text-brand-white border-brand-white bg-brand-darkgreen w-45">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">Chargement...</td>
                            </tr>
                        ) : locations.length > 0 ? (
                            locations.map((loc) => (
                                <tr key={loc.id} className="h-14">
                                    <th scope="row">{loc.id}</th>
                                    <td className="border border-brand-darkgreen pl-4">{loc.name}</td>
                                    <td className="border border-brand-darkgreen text-center">{loc.latitude}</td>
                                    <td className="border border-brand-darkgreen text-center">{loc.longitude}</td>
                                    <td className="border border-brand-darkgreen text-center">NC</td>
                                    <td className="border border-brand-darkgreen">
                                        <div className="flex justify-center items-center gap-4">
                                            <Link href={`/admin/localisations/${loc.id}`} className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
                                                <FaRegEye />
                                            </Link>
                                            <Link href={`/admin/localisations/modifier/${loc.id}`} className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
                                                <FiEdit3 />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(loc)}
                                                className="border border-red-800 shadow-lg p-2 rounded-lg text-red-800 hover:bg-red-800 hover:border-brand-white hover:text-brand-white"
                                            >
                                                <MdDeleteOutline />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">Aucune donnée</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    {/* Selection de la limite */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="limit" className="text-sm">Lignes par page:</label>
                        <select
                            id="limit"
                            value={pagination.limit}
                            onChange={(e) => {
                                const newLimit = parseInt(e.target.value, 10);
                                fetchData(1, newLimit); // reset à la page 1
                            }}
                            className="border rounded px-2 py-1"
                        >
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    {/* Buttons de gestion de la pagination */}
                    <div className="flex justify-center items-center gap-4">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => fetchData(pagination.page - 1)}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            ◀ Précédent
                        </button>
                        <span>
                            Page {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => fetchData(pagination.page + 1)}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Suivant ▶
                        </button>
                    </div>
                </div>
            </section>

            {/* MODALE */}
            {showModal && selectedLocation && (
                <div className="fixed inset-0 flex items-center justify-center bg-brand-darkgreen/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir supprimer la localisation "<strong>{selectedLocation.name}</strong>" ?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Page;
