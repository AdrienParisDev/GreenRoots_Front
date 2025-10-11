"use client";

import { MdDeleteOutline} from "react-icons/md";

interface ButtonProps {
    openModalFunction(): void;
}

// Bouton d'action pour afficher une modale de confirmation de supression. Utilisation : 
// - "openModalFunction" obligatoire : attend la fonction qui s'éxécute au clic du boutton pour ouvrir une modale de confirmation de suppression
// - exemple : <ActionDeleteButton openModalFunction={() => handleDeleteClick(loc)} /> />

export default function ActionDeleteButton({ openModalFunction }: ButtonProps) {

    return (
        <button
            onClick={openModalFunction}
            className="border border-red-800 shadow-lg p-2 rounded-lg text-red-800 hover:bg-red-800 hover:border-brand-white hover:text-brand-white"
        >
            <MdDeleteOutline />
        </button>
    );
}
