"use client";

import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import { TableHeadCell } from "@/components/admin/TableHeadCell";
import TableWrapper from "@/components/admin/TableWrapper";
import { getOrdersPaginationAdmin } from "@/services/order.api";
import useAuthStore from "@/store/AuthStore";
import { IOrder } from "@/types/index.types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaRegEye } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";

const Page = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();
    const token = user?.token;

    const search = useSearchParams();
    const currentPage = Number(search.get("page") ?? 1);
    const limit = 8;
    const [pagination, setPagination] = useState({
        total: 0,
        page: currentPage,
        limit,
        totalPages: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);

            try {
                const res = await getOrdersPaginationAdmin(limit, currentPage);
                const sortedData = res.data.sort((a, b) => a.id - b.id);
                setOrders(sortedData);
                setPagination(res.pagination_State);
            } catch (error) {
                console.error(error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, currentPage]);

    return (
        <main className="min-h-screen mt-16 mb-16 px-16 custom-size-minmax ">
            {/* Nav */}
            <nav
                aria-label="breadcrumb"
                className="mb-6 flex items-center text-sm text-gray-600"
            >
                <Link href="/admin" className="flex items-center gap-1 hover:underline">
                    <FaChevronLeft /> Admin
                </Link>
                <span className="mx-2">/</span>
                <span aria-current="page" className="font-medium text-green-700">
                    Commandes
                </span>
            </nav>

            <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
                Vue d'ensemble des commandes
            </h1>

            {/* Tableau commandes */}
            <section className="pb-10">
                <TableWrapper>
                    <thead>
                        <tr className="h-14">
                            <TableHeadCell label="Id" />
                            <TableHeadCell label="Date" withFilter />
                            <TableHeadCell label="Utilisateur" withFilter />
                            <TableHeadCell label="Statut" withFilter />
                            <TableHeadCell label="Total" withFilter />
                            <TableHeadCell label="Action" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center p-6 text-gray-500 italic"
                                >
                                    Chargement des commandes...
                                </td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="h-14">
                                    <td className="border border-brand-darkgreen text-center">
                                        {order.id}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {order.user.firstname} {order.user.lastname}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {order.status}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {order.total} €
                                    </td>
                                    <td className="border border-brand-darkgreen">
                                        <div className="flex justify-center items-center gap-4">
                                            <Link
                                                href={`/admin/commandes/${order.id}`}
                                                className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white"
                                            >
                                                <FaRegEye />
                                            </Link>
                                            <Link
                                                href={`/admin/commandes/modification/${order.id}`}
                                                className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white"
                                            >
                                                <FiEdit3 />
                                            </Link>
                                            {/* bouton de suppresion qui va ouvrir la modale */}
                                            <DeleteOrderButton order={order} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center p-6 text-gray-500 italic"
                                >
                                    Aucune commande trouvée.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </TableWrapper>

                {/* Pagination */}
                <div className="flex justify-center gap-4 mt-6">
                    {pagination.page > 1 && (
                        <Link
                            href={`/admin/commandes?page=${pagination.page - 1}`}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            ←
                        </Link>
                    )}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNumero) => (
                            <Link
                                href={`/admin/commandes?page=${pageNumero}`}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                {pageNumero}
                            </Link>
                        )
                    )}
                    {pagination.page < pagination.totalPages && (
                        <Link
                            href={`/admin/commandes?page=${pagination.page + 1}`}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            →
                        </Link>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Page;