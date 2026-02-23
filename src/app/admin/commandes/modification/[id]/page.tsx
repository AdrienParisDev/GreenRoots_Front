"use client";

import { getOneOrder, updateOrderStatus } from "@/services/order.api";
import useAuthStore from "@/store/AuthStore";
import { IOrder } from "@/types/index.types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const Page = () => {
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const { id } = useParams();

    useEffect(() => {
        if (!user?.token) return;
        getOneOrder(user.token, Number(id))
            .then(setOrder)
            .catch(() => setOrder(null));
    }, [user, id]);

    const updateStatus = async (newStatus: string) => {
        if (!order || !user?.token) return;

        setLoading(true);
        try {
            await updateOrderStatus(user?.token, order.id, newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut : ", error);
        }
        setLoading(false);
    };

    const statusConfig = {
        paid: {
            text: "paid",
            color: "text-green-600 bg-green-100",
        },
        pending: {
            text: "pending",
            color: "text-yellow-600 bg-yellow-100",
        },
        cancelled: {
            text: "cancelled",
            color: "text-red-600 bg-red-100",
        },
    } as const;

    const getStatusConfig = (status: string) => {
        return (
            statusConfig[status as keyof typeof statusConfig] || {
                text: status,
                color: "text-gray-600 bg-gray-100",
            }
        );
    };

    return (
        <main className="min-h-screen mt-16 mb-16 px-16 py-6">
            {/* Fil d'ariane */}
            <nav className="mb-6 flex items-center text-sm text-brand-green">
                <Link
                    href="/admin"
                    className="flex items-center gap-1 hover:text-brand-darkgreen"
                >
                    <FaChevronLeft /> Admin
                </Link>
                <span className="mx-2">/</span>
                <Link href="/admin/commandes" className="hover:text-brand-darkgreen">
                    Commandes
                </Link>
                <span className="mx-2">/</span>
                <span className="text-brand-darkgreen font-medium">#{order?.id}</span>
            </nav>

            {!order ? (
                <p className="text-center text-brand-green py-12">
                    Chargement de la commande...
                </p>
            ) : (
                <div className="max-w-2xl mx-auto">
                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl text-brand-darkgreen font-bold">
                            Commande #{order.id} - {order.user.firstname}{" "}
                            {order.user.lastname}
                        </h1>
                        <p className="text-brand-green text-base mt-2">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </p>
                        {/* Modifier le statut */}
                        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-brand-darkgreen">
                                Statut :
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${getStatusConfig(order.status).color
                                    }`}
                            >
                                {getStatusConfig(order.status).text}
                            </span>
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(e.target.value)}
                                disabled={loading}
                                className="text-sm border-none bg-transparent focus:ring-0"
                            >
                                {Object.entries(statusConfig).map(([status, config]) => (
                                    <option key={status} value={status}>
                                        {config.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="space-y-4 mb-8">
                        {(Array.isArray(order.items) ? order.items : [order.items]).map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 bg-brand-lightgreen/5 rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-white rounded-lg border border-brand-lightgreen/20 flex items-center justify-center">
                                        {item.product?.image_urls?.[0] && (
                                            <Image
                                                src={`http://localhost:4000/${item.product.image_urls[0]}`}
                                                alt={item.product?.name || "Produit"}
                                                width={48}
                                                height={48}
                                                className="w-10 h-10 rounded"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-brand-darkgreen font-semibold text-base">
                                            {item.product?.name}
                                        </p>
                                        <p className="text-brand-green text-sm mt-1">
                                            Quantité : {item.quantity}
                                        </p>
                                        <p className="text-brand-green text-sm mt-1">
                                            {item.unit_price}€ l'unité
                                        </p>
                                    </div>

                                    <p className="text-brand-darkgreen font-bold text-base">
                                        {item.quantity * item.unit_price}€
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Total */}
                    <div className="text-center p-6 bg-brand-lightgreen/5 rounded-lg">
                        <p className="text-brand-darkgreen font-bold text-xl">
                            Total : {order.total}€
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center mt-8">
                        <button className="px-6 py-2 border border-brand-lightgreen text-brand-lightgreen rounded-full hover:bg-brand-lightgreen/10 transition-colors cursor-pointer">
                            Annuler
                        </button>
                        <button className="px-6 py-2 bg-brand-lightgreen text-white rounded-full hover:bg-brand-green transition-colors cursor-pointer">
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Page;