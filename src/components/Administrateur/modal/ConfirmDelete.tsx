"use client";

import React from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean; // affiche ou non la modale
    title?: string; // titre personnalisé
    message?: string; // texte du message
    itemName?: string; // nom de l'élément à supprimer
    onConfirm: () => void; // action à exécuter si l’utilisateur confirme
    onCancel: () => void; // action à exécuter si l’utilisateur annule
}

// Modale de confirmation de supression d'un élément 
// exemple d'utilisation : 
//      <ConfirmDeleteModal
//        isOpen={showUserDeleteModal}
//        title="Suppression d’un utilisateur"
//        message="Voulez-vous vraiment supprimer cet utilisateur"
//        itemName={selectedUser?.username}
//        onConfirm={handleDeleteUser}
//        onCancel={() => setShowUserDeleteModal(false)}
//      />

export default function ConfirmDeleteModal({
    isOpen,
    title = "Confirmer la suppression",
    message = "Êtes-vous sûr de vouloir supprimer cet élément ?",
    itemName,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {

    if (!isOpen) return null; // rien à afficher si la modale est fermée

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-brand-darkgreen/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">
                    {message}{" "}
                    {itemName && (
                        <>
                            "<strong>{itemName}</strong>" ?
                        </>
                    )}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}