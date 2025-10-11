"use client";

import Link from "next/link";
import { FaRegEye } from "react-icons/fa";

interface ButtonProps {
    currentPieceOfURL: string;
    currentDynamicURL: string;
}

// Bouton d'action pour atteindre la page de visualisation d'un élément comme une localisation. Utilisation : 
// - "currentPieceOfURL" obligatoire : url ciblé entre  admin/  et  /currentDynamicURL
// - "currentDynamicURL" obligatoire : partie dynamique de l'url en génrale l'id
// - exemple : < ActionSeeButton currentPieceOfURL="localisations" currentDynamicURL={`${loc.id}`} />

export default function ActionSeeButton({ currentPieceOfURL, currentDynamicURL }: ButtonProps) {

    return (
        <Link href={`/admin/${currentPieceOfURL}/${currentDynamicURL}`} className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
            <FaRegEye />
        </Link>
    );
}
