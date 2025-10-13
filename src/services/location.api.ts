import { PaginatedResponse, ILocation } from "@/types/index.types";
import { apiFetch } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Avoir les localisations avec de la pagination
export async function fetchLocations(page: number, limit: number) {
    const res = await apiFetch(
        `/locations/pagination?page=${page}&limit=${limit}`,
        { method: "GET" }
    );

    if (!res.ok) {
        throw new Error("Erreur API");
    }

    const data: PaginatedResponse<ILocation> = await res.json();
    return data;
}
// router.get("/locations", checkRoles(["admin"]), locationController.getAll);


// get all orders from user (ADMIN ONLY VOIR BUTTON PAGE ACCUEIL TEST testSecureRoute.tsx : pour ADRIEN)
export async function getAllLocations() {
    const res = await apiFetch("/locations", { method: "GET" });

    if (!res.ok) {
        throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }

    return res.json(); // devrait renvoyer les commandes de l'user
}


// Récupérer toutes les localisations avec les produits liés
export async function getAllLocationsWithRelations() {
    try {
        const res = await apiFetch("/locations/with-relations", {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des localisations avec relations ❌", error);
        throw error;
    }
}

// get One location per id with products
export async function getOneLocationWithProducts(id: number): Promise<ILocation> {
    try {
        const res = await apiFetch(`/locations/${id}`, {
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


export async function createLocation(data: { name: string; latitude: number; longitude: number }) {
    try {
        const res = await apiFetch("/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur loggin", error);
        throw error;
    }
}

export async function createProductLocationLink(id: string, data: { product_id: number; }) {
    try {
        const res = await apiFetch(`/locations/${id}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur loggin", error);
        throw error;
    }
}

export async function updateLocation(
    id: string,
    data: { name?: string; latitude?: number; longitude?: number }
) {
    try {
        const res = await apiFetch(`/locations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la localisation ❌", error);
        throw error;
    }
}

export async function updateProductLocationLink(
    locationId: string,
    oldProductId: number,
    data: { product_id: number }
) {
    try {
        const res = await apiFetch(`/locations/${locationId}/products/${oldProductId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la liaison produit-localisation ❌", error);
        throw error;
    }
}

export async function deleteLocation(id: string) {
    const res = await apiFetch(`/locations/${id}`, { method: "DELETE" });

    if (!res.ok) {
        throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function deleteProductLocationLink(locationId: string, productId: number) {
    try {
        const res = await apiFetch(`/locations/${locationId}/products/${productId}`, {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de la liaison produit-localisation ❌", error);
        throw error;
    }
}