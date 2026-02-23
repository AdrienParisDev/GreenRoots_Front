import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IOrder } from "@/types/index.types";
import { deletOrderById } from "@/services/order.api";
import useAuthStore from "@/store/AuthStore";

export default function DeleteOrderButton({ order }: { order: IOrder }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useAuthStore();
    const token = user?.token;

    const handleDelete = async () => {
        if (!token) return;

        try {
            setLoading(true);
            await deletOrderById(token, order.id);
            setOpen(false);
            alert(`✅ Commande ${order.id} supprimée avec succès`);
            window.location.reload(); //reload la page
        } catch (err) {
            alert("❌ Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bouton Supprimer */}
            <button
                onClick={() => setOpen(true)}
                className="border border-red-800 shadow-lg p-2 rounded-lg text-red-800 hover:bg-red-800 hover:border-brand-white hover:text-brand-white"
            >
                <MdDeleteOutline />
            </button>

            {/* Modale */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                        <h2 className="text-lg font-bold text-red-600 mb-4">
                            Confirmation de suppression
                        </h2>
                        <p className="mb-6">
                            Êtes-vous sûr de vouloir supprimer la
                            <span className="font-semibold"> commande #{order.id} </span>?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? "Suppression..." : "Confirmer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}