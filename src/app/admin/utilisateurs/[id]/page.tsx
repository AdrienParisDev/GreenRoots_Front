"use client";

import { getOneUser } from "@/services/user.api";
import { IUser } from "@/types/index.types";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const Page = () => {
    const { id } = useParams();
    const userId = id as string;

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loc = await getOneUser(Number(userId));
                setUser(loc);
            } catch (err) {
                console.error("Erreur lors du chargement des données ❌", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    if (loading) {
        return <p className="p-10 text-center text-gray-500">Chargement...</p>;
    }

    if (!user) {
        return (
            <p className="p-10 text-center text-red-500">
                Impossible de charger l'utilisateur.
            </p>
        );
    }

    // --- 🔧 Fonctions utilitaires ---
    const capitalizeFirstLetter = (str: string | null | undefined) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Date inconnue";
        const date = new Date(dateString);

        return date.toLocaleString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
            // petite retouche de format pour ajouter "à"
            .replace(" ", " à ")
            .replace(",", "");
    };

    // --- 🔧 Données préparées ---
    const firstname = capitalizeFirstLetter(user.firstname);
    const lastname = capitalizeFirstLetter(user.lastname);
    const entityName = user.entity_name ? user.entity_name : "Particulier";

    const createdAt = formatDate(user.created_at);
    const updatedAt = formatDate(user.updated_at);

    // --- 🧱 Rendu ---
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
                <Link
                    href="/admin/utilisateurs"
                    className="flex items-center gap-1 hover:underline"
                >
                    Utilisateurs
                </Link>
                <span className="mx-2">/</span>
                <span aria-current="page" className="font-medium text-green-700">
                    Profil
                </span>
            </nav>

            <section>
                <h1>
                    #{user.id} {firstname} {lastname}
                </h1>
                <h2>
                    {user.entity_name
                        ? `Entreprise / Association : ${entityName}`
                        : "Particulier"}
                </h2>
                <p>Rôle : {user.role}</p>
                <p>Email : {user.email}</p>
                <p>Création du compte : {createdAt}</p>
                <p>Dernière modification du compte : {updatedAt}</p>
            </section>
        </main>
    );
};

export default Page;
