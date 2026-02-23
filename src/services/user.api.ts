import { PaginatedResponse, IUser } from "@/types/index.types";
import { apiFetch } from "./api";

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function getUsersPagination(
//     limit: number,
//     page: number = 1
// ): Promise<PaginatedResponse<IUser>> {
//     try {
//         const res = await apiFetch(
//             `/users/pagination?limit=${limit}&page=${page}`,
//             {
//                 cache: "no-store",
//             }
//         );
//         console.log("APPEL API");
//         if (!res.ok) {
//             throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
//         }
//         return res.json();
//     } catch (error) {
//         console.error("Erreur API:", error);
//         // si on throw new error et que le back est down, le site crash alors le mieux est de retourner un objet vide et gérer l'erreur dans le composant
//         return {
//             data: [],
//             pagination_State: {
//                 total: 0,
//                 page: 1,
//                 limit: 3,
//                 totalPages: 0,
//             },
//         };
//     }
// }

export async function getUsersPagination(
    limit: number,
    page: number = 1,
    sortBy?: string,
    sortOrder?: string
): Promise<PaginatedResponse<IUser>> {
    try {
        const params = new URLSearchParams({
            limit: String(limit),
            page: String(page),
        });

        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);

        const res = await apiFetch(`/users/pagination?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur API:", error);
        return {
            data: [],
            pagination_State: {
                total: 0,
                page: 1,
                limit,
                totalPages: 0,
            },
        };
    }
}


export async function getOneUser(id: number): Promise<IUser> {
    try {
        const res = await apiFetch(`/users/${id}`, {
            cache: "no-store",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur API:", error);
        throw error; // laisser throw pour que Next affiche error.tsx si ça bug
    }
}