"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchemaForCreate,
  ProductFormData,
} from "@/lib/validators/productSchema";
import { getProductByIdAdmin, updateProductAdmin } from "@/services/admin.api";
import { useParams } from "next/navigation";
import { IProduct } from "@/types/index.types";
import Link from "next/link";
import Image from "next/image";
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

const ProductEditPage = () => {
  const params = useParams();
  const productId = Number(params.id);

  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<IProduct | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaForCreate),
    mode: "onChange",
  });

  // Charger le produit au montage
  useEffect(() => {
    getProductByIdAdmin(productId)
      .then((res) => {
        setProduct(res);
        reset({
          ...res,
          price: res.price?.toString(),
          stock: res.stock?.toString(),
          carbon: res.carbon?.toString(),
        });
      })
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  }, [productId, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    setApiError(null);

    if (images.length > 3) {
      setApiError("❌ Vous ne devez pas uploader plus de 3 images");
      setLoading(false);
      return;
    }

    try {
      const updated = await updateProductAdmin(productId, data, images);
      setUpdatedProduct(updated); // affiche en bas
      window.alert("Produit modifié avec succès");
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof ProductFormData) =>
    `w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 
    ${errors[field]
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-brand-green"
    }`;

  if (loading) return <p className="text-center mt-8">Chargement...</p>;
  if (!product) return <p className="text-center mt-8">Produit introuvable.</p>;

  return (
    <main className="min-h-screen mt-16 px-4 custom-size-minmax ">
      <SecondaryNav />
      <div className="max-w-2xl mx-auto my-8 ">
        <Link
          href={"/admin/produits"}
          className="bg-brand-green rounded-md hover:bg-brand-lightgreen px-4 py-2"
        >
          Retour aux produits
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white mt-8 p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">
            Modifier le produit #{productId}
          </h2>

          {apiError && <p className="text-red-600">{apiError}</p>}

          {/* Nom */}
          <div>
            <label>Nom *</label>
            <input {...register("name")} className={inputClass("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Prix */}
          <div>
            <label>Prix (€) *</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className={inputClass("price")}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label>Stock</label>
            <input
              type="number"
              {...register("stock")}
              className={inputClass("stock")}
            />
            {errors.stock && (
              <p className="text-red-500">{errors.stock.message}</p>
            )}
          </div>

          {/* Nom scientifique */}
          <div>
            <label>Nom scientifique</label>
            <input
              {...register("scientific_name")}
              className={inputClass("scientific_name")}
            />
            {errors.scientific_name && (
              <p className="text-red-500">{errors.scientific_name.message}</p>
            )}
          </div>

          {/* Carbone */}
          <div>
            <label>Carbone absorbé par an (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("carbon")}
              className={inputClass("carbon")}
            />
            {errors.carbon && (
              <p className="text-red-500">{errors.carbon.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label>Description *</label>
            <textarea
              {...register("description")}
              className={inputClass("description")}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Disponibilité */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("available")}
              className="mr-2 w-10 h-10 cursor-pointer"
            />
            <label>Disponible</label>
          </div>

          {/* Images existantes */}
          {product.image_paths && product.image_paths.length > 0 && (
            <div>
              <p className="font-medium mb-2">Images actuelles :</p>
              <div className="grid grid-cols-3 gap-4">
                {product.image_paths.map((img, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                      alt={`Image ${idx + 1}`}
                      width={200}
                      height={200}
                      className="rounded border object-cover h-[200px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload nouvelles images */}
          <div>
            <p className="text-md mb-2">
              Ajouter de nouvelles images (optionnel)
            </p>
            <label
              className={`block my-2 font-medium ${images.length > 3 ? "text-red-500" : "text-green-500"
                }`}
            >
              Images (Max 3) : {images.length}/3
            </label>
            <input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />

            {images.length > 3 && (
              <p className="text-red-500 text-sm">
                ❌ Vous ne pouvez pas uploader plus de 3 images.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-darkgreen text-white py-2 rounded"
          >
            {loading ? "Modification en cours..." : "Modifier le produit"}
          </button>
        </form>

        {/* ✅ Affiche le produit mis à jour */}
        {updatedProduct && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="font-bold mb-2">Produit mis à jour :</h3>
            <pre className="text-sm">
              {JSON.stringify(updatedProduct, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductEditPage;
