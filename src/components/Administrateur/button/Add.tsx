"use client";

import Link from "next/link";
import { MdOutlineCreate } from "react-icons/md";

interface ButtonProps {
    currentLabel: string;
    currentPieceOfURL: string;
}

// Utilisation : 
// - "currentLabel" obligatoire : texte à coté de l'icone stylo 
// - "currentPieceOfURL" obligatoire : url ciblé à partir de  => admin/
// - exemple : < AddButton currentLabel="Ajouter une localisation" currentPieceOfURL="localisations/creation" />

export default function AddButton({ currentLabel, currentPieceOfURL }: ButtonProps) {

    return (
        <Link href={`/admin/${currentPieceOfURL}`} className="flex items-center px-8 border border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white">
            <MdOutlineCreate className="mr-4" />
            <p>{currentLabel}</p>
        </Link>
    );
}
