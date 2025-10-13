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
import { getProductsKPI } from "@/services/dashboard.api"
import GlobalViewBoard, { KPIData } from "@/components/Administrateur/board/GlobalView"
import { PiTreeFill } from "react-icons/pi";
import { TbMapOff, TbChristmasTreeOff, TbMapPin2 } from "react-icons/tb";

interface CataloguePageProps {
  searchParams: Promise<{ page?: string }>;
}

const Page = ({ searchParams }: CataloguePageProps) => {

  // Tableau de KPI
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const GetKPI = async () => {
    try {
      const locKPIData = await getProductsKPI();

      // Vérification du format
      if (!locKPIData) return;

      // Hydratation du tableau KPI avec les valeurs dynamiques
      const dynamicKpis: KPIData[] = [
        {
          value: locKPIData.total_products,
          title: "Arbres au total",
          icon: <PiTreeFill className="text-xl md:text-2xl text-brand-white" />,
          variant: "star",
        },
        {
          value: locKPIData.unavailable_products,
          title: "Abres non visibles pour les visiteurs",
          icon: <TbChristmasTreeOff className="text-xl md:text-2xl text-brand-lightgreen" />,
          variant: "good",
        },
        {
          value: locKPIData.low_stock_products,
          title: "Arbres dont le stock est inférieur ou égale à 30",
          icon: <TbMapPin2 className="text-xl md:text-2xl text-orange-600" />,
          variant: "warning",
        },
        {
          value: locKPIData.out_of_stock_products,
          title: "Arbre en rupture de stock",
          icon: <TbChristmasTreeOff className="text-xl md:text-2xl text-orange-600" />,
          variant: "bad",
        },
        {
          value: locKPIData.products_without_location,
          title: "Arbres sans une zone de plantation",
          icon: <TbMapOff className="text-xl md:text-2xl text-red-600" />,
          variant: "bad",
        },
      ];

      setKpis(dynamicKpis);
    } catch (error) {
      console.error("Erreur lors du chargement des KPI :", error);
    }
  }

  // Charger les KPI au montage de la page
  useEffect(() => {
    GetKPI();
  }, []);

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

      <GlobalViewBoard title="Produits" kpis={kpis} />

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
                    className={`border border-brand-darkgreen text-center ${product.available ? "" : "bg-red-300"
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
