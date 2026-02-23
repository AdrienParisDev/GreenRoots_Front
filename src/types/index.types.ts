export interface IProduct {
  available: boolean;
  carbon: string;
  description?: string;
  best_seller: boolean;
  id: number;
  image_paths: string[];
  name: string;
  price: string;
  productLocations: IProductLocation[];
  scientific_name?: string;
  slug: string;
  stock: number;
  updated_at?: string;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination_State: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ILocation {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  productLocations?: IProductLocation[];
}

export interface IProductLocation {
  product_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
  product: IProduct;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  email_validated: boolean;
  password: string;
  role: string;
  entity_name: string;
  created_at: string;
  updated_at: string;
  anonymized_at: string;
}