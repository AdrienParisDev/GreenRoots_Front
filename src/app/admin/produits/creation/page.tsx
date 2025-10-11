"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchemaForCreate,
  ProductFormData,
} from "@/lib/validators/productSchema";
import { useState } from "react";
import { createProductAdmin } from "@/services/admin.api";
import { IProduct } from "@/types/index.types";
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

const CreateProductForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<IProduct | null>(null);
  const [images, setImages] = useState<File[]>([]);

  //   on définit via la librairie react hook form le schema zod à respecter
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaForCreate),
    mode: "onChange",
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    setApiError(null);

    if (images.length === 0) {
      setApiError("❌ Vous devez uploader au moins une image");
      setLoading(false);
      return;
    }

    if (images.length > 3) {
      setApiError("❌ Vous ne devez pas upload plus de 3 images");
      setLoading(false);
      return;
    }

    try {
      const product = await createProductAdmin(data, images);
      if (!product)
        throw new Error("❌ Erreur API lors de la création du produit");

      setCreatedProduct(product); // on affiche dans la page
      window.alert("Produit crée avec succès");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Erreur inconnue");
      }
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

  return (
    <main className="min-h-screen mt-16 px-4 custom-size-minmax ">
      <SecondaryNav />
      <div className="max-w-2xl mx-auto my-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Créer un produit</h2>

          {apiError && <p className="text-red-600">{apiError}</p>}

          {/* Nom */}
          <div>
            <label>Nom</label>
            <input {...register("name")} className={inputClass("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Prix */}
          <div>
            <label>Prix (€)</label>
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
          </div>

          {/* Carbone */}
          <div>
            <label>Carbone aborsban par an (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("carbon")}
              className={inputClass("carbon")}
            />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
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

          {/* Images */}
          <div className={`text-2xl  flex flex-col space-y-4  </form>}`}>
            <p className="text-md">
              Formats acceptés : jpeg, png, jpg, gif, webp
            </p>

            <label
              className={`my-4  ${images.length < 1 || images.length > 3
                  ? "text-red-500"
                  : " text-green-500"
                }`}
            >
              Images (Min 1 / Max 3) : {images.length}/3
            </label>
            <input
              className="cursor-pointer  text-3xl my-4"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-darkgreen text-white py-2 rounded"
          >
            {loading ? "Création en cours..." : "Créer le produit"}
          </button>
        </form>

        {/* ✅ Affiche le produit créé sans rechargement */}
        {createdProduct && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="font-bold mb-2">Produit créé :</h3>
            <pre className="text-sm">
              {JSON.stringify(createdProduct, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default CreateProductForm;
