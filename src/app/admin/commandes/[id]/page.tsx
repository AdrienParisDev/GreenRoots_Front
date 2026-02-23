"use client";

import { getOneOrder } from "@/services/order.api";
import useAuthStore from "@/store/AuthStore";
import { IOrder } from "@/types/index.types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const Page = () => {
    const [order, setOrder] = useState<IOrder | null>(null);
    const { user } = useAuthStore();
    const { id } = useParams();

    useEffect(() => {
        if (!user?.token) return;
        getOneOrder(user.token, Number(id))
            .then(setOrder)
            .catch(() => setOrder(null));
    }, [user, id]);

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
                            {new Date(order.created_at).toLocaleDateString("fr-FR")} •
                            <span
                                className={`ml-1 ${order.status === "paid"
                                        ? "text-brand-green"
                                        : "text-brand-brown"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </p>
                    </div>

                    {/* Articles */}
                    <div className="space-y-4 mb-8">
                        {(Array.isArray(order.items) ? order.items : [order.items])?.map(
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
                                            {item.quantity} × {item.unit_price}€
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
                </div>
            )}
        </main>
    );
};

export default Page;