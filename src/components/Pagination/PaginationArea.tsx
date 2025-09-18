import type { Product } from "@/types/Product";
import { ProductCard } from "../ProductCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PaginationButtons } from "./PaginationButtons";

type Props = {
  products: Product[];
  itemsPerPage: number;
};

export const PaginationArea: React.FC<Props> = ({ products, itemsPerPage }) => {
  const { page } = useParams(); // <<< Получаем текущую страницу из URL

  const [currentPage, setCurrentPage] = useState(parseInt(page || "1", 10)); // <<< Текущая страница

  const totalPages = Math.ceil(products.length / itemsPerPage); // <<< Общее количество страниц

  const shownProducts = products.slice( 
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // <<< Продукты для текущей страницы

  useEffect(() => {
    setCurrentPage(parseInt(page || "1", 10));
  }, [page]); 

  return (
    <>
      <div className="products-table">
        {shownProducts.map((product) => (
          <ProductCard key={product.id} product={product} /> 
        ))} 
      </div>
      <div className="w-auto flex justify-center mx-auto">
        <PaginationButtons totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} /> {/* <<< Кнопки пагинации */}
      </div>
    </>
  );
};
