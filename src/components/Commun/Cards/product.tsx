"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TbBoxOff, TbChristmasTreeOff } from "react-icons/tb";
import { HiInformationCircle } from "react-icons/hi";


// Reste à faire : 
// utiliser interface Iproduct au lieu de cardprops sauf si utilisation de variante au final ou ça sera a gérer
// ajouter des infos quand on survole i 
// Voir si je peux ajouter des boutons différents (voir / edit) si utilisation de la card côté admin 
// Ajouter le style de bouton à découvrir
// Passer par les slug et nom les id pour accéder aux produits
// ajouter une fonction qui limite la taille de la description visible
// Ajuster la version mobile
// Ajouter une gestion des images côté back, si une image existe pas dans le dossier uploads/arbres en envoyer une par défaut


interface CardProps {
    id: number;
    name: string;
    scientific_name?: string;
    price: string;
    carbon: string;
    image_paths: string[];
    description?: string;
    avalaible: boolean;
    stock?: number;
    slug: string;
    best_seller: boolean;
    variant?: "simple" | "detailed";
}

const Card = ({
    name,
    price,
    slug,
    image_paths,
    stock,
    scientific_name,
    carbon,
    description,
    variant,
    best_seller,
    id,
}: CardProps) => {
    // pour faire la redirection slug
    const router = useRouter();

    console.log(stock)

    return (

        <div className={`bg-brand-white flex flex-col space-y-2 pb-4 rounded-sm max-w-[400px] mx-auto relative bg-brand-white overflow-hidden shadow-[2px_2px_12px_rgba(0,0,0,1)]
        ${variant === "detailed" ? "min-h-[700px]" : "min-h-[500px]"}`}>
            <div className="relative h-[400px] w-full ">
                {/* Gestion de l'image, si diponbile ou pas  */}
                {image_paths?.length > 0 && image_paths[0] ? (
                    <Image
                        src={`http://localhost:4000/${image_paths[0]}`}
                        alt={name}
                        height={600}
                        width={400}
                        className="absolute w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute flex flex-col items-center justify-center bg-brand-lightgreen w-full h-full text-brand-white">
                        <TbChristmasTreeOff
                            className="w-[80px] h-[80px] mb-4"
                        />
                        <p className="text-2xl font-bold">
                            Visuels bientôt diponibles
                        </p>
                    </div>
                )}
                {best_seller === true ?
                    <p className="absolute bg-brand-lightgreen top-[61px] right-[-85px] rotate-36 uppercase text-2xl text-brand-white font-bold px-20 py-2 [box-shadow:inset_2px_2px_12px_0px_rgba(0,0,0,1),inset_-2px_-2px_12px_0px_rgba(0,0,0,1)] ">
                        Meilleures ventes
                    </p>
                    : ""}
                {stock === 0 && (
                    <div className="absolute flex flex-col items-center justify-center bg-black/50 w-full h-full text-brand-white z-20">
                        <TbBoxOff className="w-[80px] h-[80px] mb-4" />
                        <p className="text-2xl font-bold">Rupture de stock</p>
                    </div>
                )}
            </div>
            <div className="p-5">
                <p className="text-brand-green text-2xl font-bold mb-2">
                    {name}
                </p>
                <p className="text-gray-500 italic text-sm mb-1">
                    Non scientifique : {scientific_name}</p>
                <div className="flex mb-3">
                    <p>
                        <b className="text-brand-darkgreen font-bold">CO<sup> 2</sup></b> : <i className="text-brand-green">-{carbon} kg </i>
                    </p>
                    <HiInformationCircle
                        className="text-brand-green ml-1"
                    />
                </div>
                <p className="mb-5">
                    {description}
                </p>
                <div className="flex justify-between">
                    <p className="font-bold text-2xl md:ml-6">{price} €</p>
                    <button onClick={() => router.push(`/catalogue/${id}`)}>
                        Découvrir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
