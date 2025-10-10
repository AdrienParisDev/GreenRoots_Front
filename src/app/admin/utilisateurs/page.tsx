"use client";

import { use, useEffect, useState } from "react";
import { TableHeadCell } from "@/components/admin/TableHeadCell";
import TableWrapper from "@/components/admin/TableWrapper";
import { getUsersPagination } from "@/services/user.api";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { IUser } from "@/types/index.types";
import { FaChevronLeft } from "react-icons/fa";

interface CataloguePageProps {
    searchParams: Promise<{ page?: string }>;
}

const Page = ({ searchParams }: CataloguePageProps) => {
    const { page } = use(searchParams);
    const currentPage = Number(page) || 1;

    const limit = 2;

    const [users, setUser] = useState<IUser[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: currentPage,
        limit,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getUsersPagination(limit, currentPage)
            .then((res) => {
                setUser(res.data);
                setPagination(res.pagination_State);
                console.log("Réponse brute admin:", res);
            })
            .finally(() => setLoading(false));
    }, [currentPage]);

    if (loading)
        return <p className="text-center mt-8 min-h-[60vh]">Chargement...</p>;

    return (
        <main className="min-h-screen mt-16 px-4 custom-size-minmax ">
            <nav
                aria-label="breadcrumb"
                className="mb-6 flex items-center text-sm text-gray-600"
            >
                <Link href="/admin" className="flex items-center gap-1 hover:underline">
                    <FaChevronLeft /> Admin
                </Link>
                <span className="mx-2">/</span>
                <span aria-current="page" className="font-medium text-green-700">
                    Utilisateurs
                </span>
            </nav>
            <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
                Vue d&apos;ensemble des Utilisateurs
            </h1>

            <section className="pb-10">
                <TableWrapper>
                    <thead>
                        <tr className="h-14">
                            <TableHeadCell label="Id" />
                            <TableHeadCell label="Prénom" withFilter />
                            <TableHeadCell label="Nom" withFilter />
                            <TableHeadCell label="E-mail" withFilter />
                            <TableHeadCell label="Role" withFilter />
                            <TableHeadCell label="Action" />
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="h-14">
                                    <td className="border border-brand-darkgreen text-center">
                                        {user.id}
                                    </td>
                                    <td className="border border-brand-darkgreen pl-4">
                                        {user.firstname}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {user.lastname}
                                    </td>
                                    <td className="border border-brand-darkgreen text-center">
                                        {user.email}
                                    </td>
                                    <td className={"border border-brand-darkgreen text-center"}>
                                        {user.role}
                                    </td>
                                    <td className="border border-brand-darkgreen">
                                        <div className="flex justify-center items-center gap-4">
                                            <Link
                                                href={`/admin/utilisateurs/${user.id}`}
                                                className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white"
                                            >
                                                <FaRegEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center p-6 text-gray-500 italic"
                                >
                                    Aucun produit trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </TableWrapper>

                {/* Pagination */}
                <div className="flex justify-center gap-4 mt-6">
                    {pagination.page > 1 && (
                        <Link
                            href={`/admin/utilisateurs?page=${pagination.page - 1}`}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            ← Précédent
                        </Link>
                    )}
                    {pagination.page < pagination.totalPages && (
                        <Link
                            href={`/admin/utilisateurs?page=${pagination.page + 1}`}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Suivant →
                        </Link>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Page;
