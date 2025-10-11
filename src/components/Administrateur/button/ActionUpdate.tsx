"use client";

import Link from "next/link";
import { FiEdit3 } from "react-icons/fi";

interface ButtonProps {
    currentPieceOfURL: string;
    currentDynamicURL: string;
}

// Bouton d'action pour atteindre la page de modification d'un élément comme une localisation. Utilisation : 
// - "currentPieceOfURL" obligatoire : url ciblé entre  admin/  et  /currentDynamicURL
// - "currentDynamicURL" obligatoire : partie dyn amique de l'url en génrale l'id
// - exemple : < ActionUpdateButton currentPieceOfURL="localisations/modifier" currentDynamicURL={`${loc.id}`} />

export default function ActionUpdateButton({ currentPieceOfURL, currentDynamicURL }: ButtonProps) {

    return (
        <Link href={`/admin/${currentPieceOfURL}/${currentDynamicURL}`} className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
            <FiEdit3 />
        </Link>
    );
}
