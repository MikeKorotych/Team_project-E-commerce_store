import type { Product } from "@/types/Product";
import { ProductCard } from "../ProductCard";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PaginationButtons } from "./PaginationButtons";

type Props = {
  products: Product[];
  itemsPerPage: number;
};

export const PaginationArea: React.FC<Props> = ({ products, itemsPerPage }) => {
  const { page } = useParams(); // <<< Получаем текущую страницу из URL
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(parseInt(page || "1", 10)); // <<< Текущая страница

  const totalPages = Math.ceil(products.length / itemsPerPage); // <<< Общее количество страниц

  const shownProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // <<< Продукты для текущей страницы

  useEffect(() => {
    if (parseInt(page || "1", 10) > totalPages) {
      setCurrentPage(totalPages);
      navigate(`../${totalPages}?limit=${itemsPerPage}`)
    } else {
      setCurrentPage(parseInt(page || "1", 10));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages]);

  return (
    <>
      <div className="products-table">
        {shownProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="w-auto flex justify-center mx-auto">
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </>
  );
};
