import { apiFetch } from "./api";

interface ILocationKPI {
    total_locations: number;
    products_with_location: number;
    locations_without_product: number;
    products_without_location: number;
}

interface ILProductKPI {
    total_products: number;
    low_stock_products: number;
    out_of_stock_products: number;
    unavailable_products: number;
    products_without_location: number;
}

export async function getLocationsKPI() {
    const res = await apiFetch(
        `/dashboard/locations`,
        { method: "GET" }
    );

    if (!res.ok) {
        throw new Error("Erreur API");
    }

    const data: ILocationKPI = await res.json();
    return data;
}

export async function getProductsKPI() {
    const res = await apiFetch(
        `/dashboard/products`,
        { method: "GET" }
    );

    if (!res.ok) {
        throw new Error("Erreur API");
    }

    const data: ILProductKPI = await res.json();
    return data;
}