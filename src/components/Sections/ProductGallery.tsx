"use client";

import { useState } from "react";
import Image from "next/image";
import { IProduct } from "@/types/index.types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface IGalleryProps {
  product: IProduct;
}

const ProductGallery = ({ product }: IGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product.image_paths;

  const total = images.length;

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const normalizedImages = images.map((img) => img.replace(/\\/g, "/"));


  return (
    <article className="h-full relative">
      {/* Bloc image principale */}
      <div className="relative h-full w-full aspect-square overflow-hidden rounded-lg">
        <Image
          // API_URL = http://localhost:4000
          src={`${API_URL}/${normalizedImages[currentIndex]}`}
          alt={`${product.name} ${currentIndex + 1}`}
          fill
          sizes="max-width: 100px"
          className="object-cover transition-all duration-300"
          priority
        />
        {product.stock > 0 ? (
          <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
            En stock
          </span>
        ) : (
          <span className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
            En rupture
          </span>
        )}
      </div>

      {/* Mobile : petits indicateurs (boules) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex  justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(index)}
            className={`w-4 h-4 rounded-full transition cursor-pointer 
              ${currentIndex === index ? "bg-green-600" : "bg-gray-300"}`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* fleches sur image */}
      <FaChevronLeft
        onClick={handlePrev}
        className="absolute  top-1/2 -translate-y-1/2 left-5 text-brand-darkgreen w-10 h-10 md:w-20 md:h-20 hover:scale-125 hover:cursor-pointer"
      />
      <FaChevronRight
        onClick={handleNext}
        className="absolute  top-1/2 -translate-y-1/2 right-5 text-brand-darkgreen w-10 h-10 md:w-20 md:h-20 hover:scale-125 hover:cursor-pointer"
      />
    </article>
  );
};

export default ProductGallery;
