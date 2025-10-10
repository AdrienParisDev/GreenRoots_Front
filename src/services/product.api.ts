import { PaginatedResponse, IProduct } from "@/types/index.types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { method: "GET", cache: "no-store", });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error; // laisser throw pour que Next affiche error.tsx si ça bug
  }
}

// get products with choice (number)
export async function getProductsPagination(
  limit: number,
  page: number = 1
): Promise<PaginatedResponse<IProduct>> {
  try {
    const res = await fetch(
      `${API_URL}/products/pagination/all?limit=${limit}&page=${page}`,
      {
        cache: "no-store",
      }
    );
    console.log("APPEL API");
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Erreur API:", error);
    // si on throw new error et que le back est down, le site crash alors le mieux est de retourner un objet vide et gérer l'erreur dans le composant
    return {
      data: [],
      pagination_State: {
        total: 0,
        page: 1,
        limit: 3,
        totalPages: 0,
      },
    };
  }
}

// get One product per id
export async function getOneProductWithLocation(id: number): Promise<IProduct> {
  try {
    const res = await fetch(`${API_URL}/products/with_location/${id}`, {
      cache: "no-store",
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

// get the stock of a product
export async function getStockForProduct(productId: number) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ item }),
    });
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
}
