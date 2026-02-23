"use client";

import OrderValidation from "@/components/OrderValidation";
import useCartStore from "@/store/CartStore";
// import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaTrash } from "react-icons/fa";

export default function PanierPage() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const update = useCartStore((state) => state.update);
  const remove = useCartStore((state) => state.remove);

  return (
    <main className="min-h-screen mt-16 mb-16 px-4 py-6 md:py-8">
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        {/* Lien retour */}
        <Link
          href="/catalogue"
          className="flex items-center mb-10 text-brand-lightgreen"
        >
          <FaChevronLeft className="mr-4" />
          Retour
        </Link>

        <h1 className="text-2xl font-extrabold text-brand-darkgreen uppercase mb-8">
          Mon Panier
        </h1>

        {/* si panier vide avec un spread operator */}
        {items.length === 0 ? (
          <p className="text-gray-500">Votre panier est vide.</p>
        ) : (
          <section className="grid md:grid-cols-3 gap-8">
            {/* liste des articles */}
            <div className="md:col-span-2">
              {items.map(
                (
                  item // un map pour afficher chaque item du panier
                ) => (
                  <div
                    key={item.id} // clé unique pour chaque élément de la liste
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center">
                      {/* <Image
                        src={`http://localhost:4000/${item.image_urls[0]}`}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md mr-4"
                      /> */}
                      <div>
                        <h2 className="text-lg font-bold text-brand-darkgreen">
                          {item.name}
                        </h2>
                        <p className="text-gray-500">{item.price} €</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => update(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-brand-green text-white rounded-full hover:bg-brand-lightgreen"
                      >
                        -
                      </button>
                      <span className="mx-3 font-bold text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => update(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-brand-green text-white rounded-full hover:bg-brand-lightgreen"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="ml-5 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* résumé du panier */}
            <aside className="bg-brand-white shadow-md rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-brand-darkgreen uppercase mb-4">
                  Résumé
                </h3>
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{getTotal()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total TTC</span>
                  <span>{getTotal()} €</span>
                </div>
              </div>

              <OrderValidation />
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
