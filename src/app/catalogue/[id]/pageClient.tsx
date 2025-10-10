"use client";

import Link from "next/link";
import { FaInfoCircle, FaChevronLeft } from "react-icons/fa";
import ProductGallery from "@/components/Sections/ProductGallery";

import { IProduct } from "@/types/index.types";
import CartForm from "@/components/CartForm";
import Map from "@/components/Map";

const PageClient = ({ product }: { product: IProduct | null }) => {
  if (!product) return <p>Produit indisponibles</p>;

  return (
    <main className="md:w-[90vw] 2xl:w-[60vw] mx-auto py-8 px-4 custom-size-minmax">
      {/* Fil d’ariane */}
      <nav
        aria-label="breadcrumb"
        className="mb-6 flex items-center text-sm text-gray-600"
      >
        <Link href="/" className="flex items-center gap-1 hover:underline">
          <FaChevronLeft /> Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalogue" className="hover:underline">
          Nos arbres
        </Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="font-medium text-green-700">
          {product.name}
        </span>
      </nav>

      <section className="flex flex-col md:flex-row gap-8 bg-brand-white rounded-md py-8 px-4">
        {/* Image produit */}
        <article className="rounded-xl shadow  md:w-1/2">
          <div className="relative w-full h-[500px] md:h-[700px]">
            {product.image_paths && product.image_paths.length > 0 ? (
              <ProductGallery product={product} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500 italic">Aucune image disponible</p>
              </div>
            )}
          </div>
        </article>

        {/* Infos produit */}
        <aside className="flex flex-col justify-between md:w-1/2 ">
          <header className="">
            <h1 className="text-3xl font-bold text-green-700">
              {product.name}
            </h1>
            {product.scientific_name && (
              <h3 className=" font-bold text-black mt-4">
                Nom scientifique : {product.scientific_name}
              </h3>
            )}
            <p className="text-xl font-semibold mt-2">
              {product.price} € / unité
            </p>
            <p className="mt-4 text-gray-700">{product.description}</p>
          </header>

          <section className="mt-6 ">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
              <FaInfoCircle /> Détails du produit
            </h2>
            <ul className="mt-2 space-y-2 text-gray-700 ">
              <li>
                Stock disponible :{" "}
                <span className="font-semibold text-green-600">
                  {product.stock} unités
                </span>
              </li>
              {product.carbon ? (
                <li>Carbone absorbé : {product.carbon} kg CO₂/an</li>
              ) : (
                <li>Carbone absorbé : En cours de calcul</li>
              )}
              {product.productLocations.length >= 1 ? (
                <li>
                  Localisation :{" "}
                  {product.productLocations?.map((pl, i) => (
                    <span key={i} className="mr-2">
                      {pl.location?.name}
                    </span>
                  ))}
                </li>
              ) : (
                <li>Localisation : En cours de selection</li>
              )}
            </ul>
          </section>

          {/* Commander */}
          {product.stock > 0 ? (
            <CartForm
              price={product.price}
              stock={product.stock}
              product={product}
            />
          ) : (
            <div className="mt-6 text-center p-4 border border-red-300 rounded-md bg-red-50 text-red-700 font-semibold">
              Rupture de stock – ce produit n’est pas disponible pour le moment.
            </div>
          )}
        </aside>
      </section>

      <section className="mt-8">
        {product.productLocations.length >= 1 ? (
          <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            Lieu de plantation
          </h2>
        ) : (
          <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
            Lieu de plantation : En cours de selection
          </h2>
        )}
        <div className="w-full h-[400px] rounded-lg overflow-hidden border">
          <Map
            places={
              product.productLocations?.map((pl) => ({
                id: pl.location.id,
                name: pl.location.name,
                lat: pl.location.latitude ?? 46.6031,
                lng: pl.location.longitude ?? 1.8883,
              })) || []
            }
          />
        </div>
      </section>

      {/* section texte explicatif */}
      <section className="flex flex-col md:flex-row my-8 ">
        {product.carbon ? (
          // Cas où on a une valeur en BDD
          <article className="flex flex-col justify-center bg-brand-white shadow-md p-5 rounded-md py-10 mb-5 md:mb-0 md:mr-8">
            <div className="flex mb-4">
              <FaInfoCircle className="text-brand-green mr-2" />
              <p>
                <b>CO₂</b> absorbé : en plantant un {product.name}, vous
                absorberez <b>{product.carbon} kg de CO₂</b>
              </p>
            </div>
            <p className="mb-4">
              Période d&apos;absorption du CO₂ : 0 ans / 10 ans* <br />
              Absorption annuelle moyenne :{" "}
              <b>{Number(product.carbon) / 10} kg</b>
            </p>
            <p className="text-xs italic">
              * L&apos;arbre continuera à absorber du CO₂ même après la dixième
              année. Il s&apos;agit donc d&apos;une estimation prudente.
            </p>
          </article>
        ) : (
          // Pas de valeur en BDD → texte générique
          <article className="flex flex-col justify-center bg-brand-white shadow-md p-5 rounded-md py-10 mb-5 md:mb-0 md:mr-8">
            <div className="flex mb-4">
              <FaInfoCircle className="text-brand-green mr-2" />
              <p>
                <b>CO₂</b> absorbé : en plantant un {product.name}, vous
                contribuerez à la capture de CO₂ et à l&apos;amélioration de la
                biodiversité.
              </p>
            </div>
            <p className="mb-4">
              Chaque arbre joue un rôle essentiel dans la régulation du climat
              et le maintien de la qualité de l&apos;air.
            </p>
            <p className="text-xs italic">
              * L&apos;absorption varie selon l&apos;espèce et les conditions
              environnementales.
            </p>
          </article>
        )}
        <article className="flex flex-col justify-center bg-brand-white shadow-md p-5 rounded-md py-10">
          <h4 className="text-lg font-extrabold text-brand-darkgreen mb-4">
            Ce qui est inclus ?
          </h4>
          <p className="text-lg font-bold text-brand-lightgreen mb-4">
            Transparence et traçabilité
          </p>
          <p className="mb-6">
            Tous les arbres de GreenRoots sont géolocalisés et photographiés
            lors de leur plantation. Une fois acheté, il faut compter entre
            quelques semaines et plusieurs mois avant qu&apos;il soit prêt à
            être planté.
          </p>
          <p className="text-lg font-bold text-brand-lightgreen mb-4">
            Une histoire qui dure
          </p>
          <p>
            En plantant un arbre, vous aurez accès à notre plateforme numérique
            riche en contenus pour suivre l’évolution de vos arbres.
          </p>
        </article>
      </section>
    </main>
  );
};

export default PageClient;
