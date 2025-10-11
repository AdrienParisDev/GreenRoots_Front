"use client";

import { use, useEffect, useState } from "react";
import { TableHeadCell } from "@/components/admin/TableHeadCell";
import TableWrapper from "@/components/admin/TableWrapper";
import { getProductsPaginationAdmin } from "@/services/admin.api";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import DeleteButton from "@/components/admin/DeleteButton";
import { IProduct } from "@/types/index.types";
import SecondaryNav from "@/components/Administrateur/nav/SecondaryNav";

interface CataloguePageProps {
  searchParams: Promise<{ page?: string }>;
}

const Page = ({ searchParams }: CataloguePageProps) => {
  const { page } = use(searchParams);
  const currentPage = Number(page) || 1;

  const limit = 8;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: currentPage,
    limit,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsPaginationAdmin(limit, currentPage)
      .then((res) => {
        setProducts(res.data);
        setPagination(res.pagination_State);
        console.log("Réponse brute admin:", res);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  if (loading)
    return <p className="text-center mt-8 min-h-[60vh]">Chargement...</p>;

  return (
    <main className="min-h-screen mt-16 px-4 custom-size-minmax ">
      <SecondaryNav />
      <h1 className="font-extrabold text-brand-green text-4xl text-center mb-6">
        Vue d&apos;ensemble des produits
      </h1>

      <div className=" my-6">
        <Link
          href={"/admin/produits/creation"}
          className="bg-brand-green rounded-md hover:bg-brand-lightgreen px-4 py-2"
        >
          Créer un produit
        </Link>
      </div>

      <section className="pb-10">
        <TableWrapper>
          <thead>
            <tr className="h-14">
              <TableHeadCell label="Id" />
              <TableHeadCell label="Nom" withFilter />
              <TableHeadCell label="Prix" withFilter />
              <TableHeadCell label="Stock" withFilter />
              <TableHeadCell label="Available" withFilter />
              <TableHeadCell label="Action" />
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="h-14">
                  <td className="border border-brand-darkgreen text-center">
                    {product.id}
                  </td>
                  <td className="border border-brand-darkgreen pl-4">
                    {product.name}
                  </td>
                  <td className="border border-brand-darkgreen text-center">
                    {product.price} €
                  </td>
                  <td className="border border-brand-darkgreen text-center">
                    {product.stock}
                  </td>
                  <td
                    className={`border border-brand-darkgreen text-center ${
                      product.available ? "" : "bg-red-300"
                    }`}
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </td>
                  <td className="border border-brand-darkgreen">
                    <div className="flex justify-center items-center gap-4">
                      <Link
                        href={`/catalogue/${product.id}`}
                        className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white"
                      >
                        <FaRegEye />
                      </Link>
                      <Link
                        href={`/admin/produits/modification/${product.id}`}
                        className="border border-brand-darkgreen shadow-lg p-2 rounded-lg text-brand-darkgreen hover:bg-brand-lightgreen hover:border-brand-white hover:text-brand-white"
                      >
                        <FiEdit3 />
                      </Link>
                      {/* bouton de suppresion qui va ouvrir la modale */}
                      <DeleteButton product={product} />
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
              href={`/admin/produits?page=${pagination.page - 1}`}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              ← Précédent
            </Link>
          )}
          {pagination.page < pagination.totalPages && (
            <Link
              href={`/admin/produits?page=${pagination.page + 1}`}
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
