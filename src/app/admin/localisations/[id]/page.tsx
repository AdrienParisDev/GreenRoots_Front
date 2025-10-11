"use client";

import { getOneLocationWithProducts } from "@/services/location.api";
import { ILocation } from "@/types/index.types";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

const Page = () => {
    const { id } = useParams();
    const locationId = id as string;

    const [location, setLocation] = useState<ILocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loc = await getOneLocationWithProducts(Number(locationId));
                setLocation(loc);
            } catch (err) {
                console.error("Erreur lors du chargement des données ❌", err);
            } finally {
                setLoading(false);
            }
        };

        if (locationId) {
            fetchData();
        }
    }, [locationId]);

    if (loading) {
        return <p className="p-10 text-center text-gray-500">Chargement...</p>;
    }

    if (!location) {
        return (
            <p className="p-10 text-center text-red-500">
                Impossible de charger la localisation.
            </p>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-6 py-10">
            <SecondaryNav currentLabel="Voir une localisation" />
            <h1 className="text-3xl font-bold mb-4">{location.name}</h1>

            {/* Carte (ex. Leaflet ou Mapbox plus tard) */}
            <div className="mb-8">
                <p className="text-gray-600">
                    📍 Latitude : {location.latitude} | Longitude : {location.longitude}
                </p>
            </div>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Produits associés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {location.productLocations?.map(({ product }) => (
                        <div
                            key={product.id}
                            className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="relative w-full h-48 mb-3">
                                <Image
                                    src={`http://localhost:4000/${product.image_paths[0]}`}
                                    alt={product.name}
                                    fill
                                    className="w-full h-full object-cover rounded-t-lg"
                                />
                            </div>
                            <h3 className="text-xl font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 italic">{product.scientific_name}</p>
                            <p className="mt-2 text-gray-700">{product.description}</p>
                            <p className="mt-2 font-semibold">{product.price} €</p>
                            <p className={`mt-1 ${product.available ? "text-green-600" : "text-red-500"}`}>
                                {product.available ? "En stock" : "Indisponible"}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Page;