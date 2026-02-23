import { Order } from "@/store/AuthStore";
import { apiFetch } from "./api";
import { IOrder, PaginatedResponse } from "@/types/index.types";

// get all orders from user (using the wrapper)
export async function getMyOrders(token: string): Promise<{ orders: Order[] }> {
  const res = await apiFetch("/orders/me/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// get one order from user
export async function getOneOrder(token: string, orderId: number) {
  const res = await apiFetch(`/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// create a new order
export async function createNewOrder(token: string, data: any) {
  const res = await apiFetch("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// get the items for an order
export async function getOrderItems(token: string, orderId: number) {
  const res = await apiFetch(`/orders/${orderId}/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// delete an order by id (admin)
export async function deletOrderById(token: string, orderId: number) {
  const res = await apiFetch(`/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// update the status of an order (admin)
export async function updateOrderStatus(
  token: string,
  orderId: number,
  status: string
) {
  const res = await apiFetch(`/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// orders with pagination (admin)
export async function getOrdersPaginationAdmin(
  limit: number,
  page: number = 1
): Promise<PaginatedResponse<IOrder>> {
  try {
    const res = await apiFetch(
      `/orders/pagination/all?limit=${limit}&page=${page}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Erreur API:", error);
    return {
      data: [],
      pagination_State: { total: 0, page: 1, limit, totalPages: 0 },
    };
  }
}