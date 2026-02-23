// "use client";

// import { use, useEffect, useState } from "react";
// import { TableHeadCell } from "@/components/admin/TableHeadCell";
// import TableWrapper from "@/components/admin/TableWrapper";
// import { getUsersPagination } from "@/services/user.api";
// import Link from "next/link";
// import { FaRegEye } from "react-icons/fa";
// import { IUser } from "@/types/index.types";
// import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

// import { TableWithPagination, Column } from "@/components/Administrateur/table/TableWithPagination";
// import ActionSeeButton from "@/components/Administrateur/button/ActionSee";

// const Page = () => {
//     /* ----------------------------------------------------
//       * Colonnes dynamiques du tableau
//       * ---------------------------------------------------- */
//     const columns: Column<IUser>[] = [
//         { key: "id", label: "ID", width: "80px" },
//         {
//             key: "firstname",
//             label: "Prénom",
//             render: (user) => {
//                 const firstname = user.firstname
//                     ? user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
//                     : "";
//                 return <span>{firstname}</span>;
//             },
//         },
//         {
//             key: "lastname",
//             label: "Nom",
//             render: (user) => {
//                 const lastname = user.lastname
//                     ? user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
//                     : "";
//                 return <span>{lastname}</span>;
//             },
//         },
//         { key: "email", label: "E-mail" },
//         {
//             key: "email_validated",
//             label: "E-mail Valide",
//             render: (user) => (
//                 <div className="flex justify-center">
//                     {user.email_validated ? (
//                         <span className="text-green-600 font-semibold">Valide</span>
//                     ) : (
//                         <span className="text-orange-600 font-semibold"> En attente </span>
//                     )}
//                 </div>
//             ),
//         },
//         { key: "role", label: "Rôle" },
//         {
//             key: "created_at",
//             label: "Inscription",
//             render: (user) => {
//                 if (!user.created_at) return "";
//                 const date = new Date(user.created_at);
//                 const formattedDate = date.toLocaleDateString("fr-FR");
//                 return <span>{formattedDate}</span>;
//             },
//         },
//         {
//             key: "anonymized_at",
//             label: "Désinscription",
//             render: (user) => {
//                 if (!user.anonymized_at) return <></>; // Ne rien afficher
//                 const date = new Date(user.anonymized_at);
//                 const formattedDate = date.toLocaleDateString("fr-FR");
//                 return <span>{formattedDate}</span>;
//             },
//         },
//         {
//             key: "actions",
//             label: "Actions",
//             width: "120px",
//             render: (user) => (
//                 <div className="flex justify-center">
//                     < ActionSeeButton currentPieceOfURL="utilisateurs" currentDynamicURL={`${user.id}`} />
//                 </div>
//             ),
//         },
//     ];

//     /* ----------------------------------------------------
//      * États locaux
//      * ---------------------------------------------------- */
//     const currentPage = 1;
//     const limit = 5;

//     const [users, setUsers] = useState<IUser[]>([]);
//     const [pagination, setPagination] = useState({
//         total: 0,
//         page: currentPage,
//         limit,
//         totalPages: 1,
//     });
//     const [loading, setLoading] = useState(true);

//     // États pour le tri
//     const [sortBy, setSortBy] = useState<string | null>(null);
//     const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//     /* ----------------------------------------------------
//      * Fonction réutilisable pour charger les données
//      * ---------------------------------------------------- */
//     const fetchData = async (page: number, limit: number) => {
//         try {
//             setLoading(true);
//             const res = await getUsersPagination(limit, page);

//             console.log(res)
//             setUsers(res.data);
//             setPagination(res.pagination_State);
//         } catch (error) {
//             console.error("Erreur lors du chargement des utilisateurs :", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ----------------------------------------------------
//      * Charger les données au montage et lors du changement de page
//      * ---------------------------------------------------- */
//     useEffect(() => {
//         fetchData(currentPage, limit);
//     }, [currentPage]);


//     if (loading)
//         return <p className="text-center mt-8 min-h-[60vh]">Chargement...</p>;

//     return (
//         <main className="min-h-screen mt-16 px-4 custom-size-minmax ">
//             <SecondaryNav />
//             <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
//                 Vue d&apos;ensemble des Utilisateurs
//             </h1>

//             <section className="pb-10">
//                 <TableWithPagination
//                     columns={columns}
//                     data={users}
//                     loading={loading}
//                     page={pagination.page}
//                     totalPages={pagination.totalPages}
//                     limit={pagination.limit}
//                     onPageChange={(p) => fetchData(p, pagination.limit)}
//                     onLimitChange={(l) => fetchData(1, l)}
//                     // --------------------- //
//                     onSort={handleSort} // 🆕 ajout de la fonction de tri
//                     sortBy={sortBy} // 🆕 état actuel du tri
//                     sortOrder={sortOrder}
//                     // --------------------- //
//                 />
//             </section>
//         </main>
//     );
// };

// export default Page;

"use client";

import { useEffect, useState } from "react";
import { getUsersPagination } from "@/services/user.api";
import { IUser } from "@/types/index.types";
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";
import { TableWithPagination, Column } from "@/components/Administrateur/table/TableWithPagination";
import ActionSeeButton from "@/components/Administrateur/button/ActionSee";

const Page = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);

    // 🆕 États pour le tri
    const [sortBy, setSortBy] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    /* ----------------------------------------------------
     * Colonnes dynamiques du tableau
     * ---------------------------------------------------- */
    const columns: Column<IUser>[] = [
        { key: "id", label: "ID", sortable: true },
        {
            key: "firstname",
            label: "Prénom",
            sortable: true,
            render: (user) => {
                const firstname = user.firstname
                    ? user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
                    : "";
                return <span>{firstname}</span>;
            },
        },
        {
            key: "lastname",
            label: "Nom",
            sortable: true,
            render: (user) => {
                const lastname = user.lastname
                    ? user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
                    : "";
                return <span>{lastname}</span>;
            },
        },
        { key: "email", label: "E-mail", sortable: true },
        {
            key: "email_validated",
            label: "E-mail Valide",
            render: (user) => (
                <div className="flex justify-center">
                    {user.email_validated ? (
                        <span className="text-green-600 font-semibold">Valide</span>
                    ) : (
                        <span className="text-orange-600 font-semibold">En attente</span>
                    )}
                </div>
            ),
        },
        { key: "role", label: "Rôle", sortable: true },
        {
            key: "created_at",
            label: "Inscription",
            sortable: true,
            render: (user) => {
                if (!user.created_at) return "";
                const date = new Date(user.created_at);
                return <span>{date.toLocaleDateString("fr-FR")}</span>;
            },
        },
        {
            key: "anonymized_at",
            label: "Désinscription",
            sortable: true,
            render: (user) => {
                if (!user.anonymized_at) return null;
                const date = new Date(user.anonymized_at);
                return <span>{date.toLocaleDateString("fr-FR")}</span>;
            },
        },
        {
            key: "actions",
            label: "Actions",
            render: (user) => (
                <div className="flex justify-center">
                    <ActionSeeButton
                        currentPieceOfURL="utilisateurs"
                        currentDynamicURL={`${user.id}`}
                    />
                </div>
            ),
        },
    ];

    /* ----------------------------------------------------
     * Chargement des données
     * ---------------------------------------------------- */
    const fetchData = async (page: number, limit: number, sortBy?: string, sortOrder?: string) => {
        try {
            setLoading(true);
            const res = await getUsersPagination(limit, page, sortBy, sortOrder);
            setUsers(res.data);
            setPagination(res.pagination_State);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.page, pagination.limit, sortBy, sortOrder);
    }, [pagination.page, pagination.limit, sortBy, sortOrder]);

    /* ----------------------------------------------------
     * Gestion du clic sur un header sortable
     * ---------------------------------------------------- */
    const handleSort = (columnKey: string) => {
        if (sortBy === columnKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnKey);
            setSortOrder("asc");
        }
    };

    return (
        <main className="min-h-screen mt-16 px-4 custom-size-minmax">
            <SecondaryNav />
            <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
                Vue d&apos;ensemble des Utilisateurs
            </h1>

            <section className="pb-10">
                <TableWithPagination
                    columns={columns}
                    data={users}
                    loading={loading}
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    limit={pagination.limit}
                    onPageChange={(p) => fetchData(p, pagination.limit, sortBy, sortOrder)}
                    onLimitChange={(l) => fetchData(1, l, sortBy, sortOrder)}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </section>
        </main>
    );
};

export default Page;
