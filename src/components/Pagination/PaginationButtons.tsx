import { Link, useNavigate } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { totalPages: number; currentPage: number; itemsPerPage: number };

export const PaginationButtons: React.FC<Props> = ({
  totalPages,
  currentPage,
  itemsPerPage,
}) => {
  const navigate = useNavigate();

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 3); // Показываемые страницы (начало и конец)

  const pagesToShow = []; // Массив страниц для отображения

  for (let i = start; i <= end; i++) {
    pagesToShow.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="secondary"
            onClick={() =>
              currentPage > 1 &&
              navigate(`/phones/${currentPage - 1}?limit=${itemsPerPage}`)
            }
            className="h-10 w-10 items-center justify-center py-5"
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>
        {pagesToShow.map((page) => {
          return (
            <PaginationItem key={page}>
              <Link to={`/phones/${page}?limit=${itemsPerPage}`}>
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  className="h-10 w-10 items-center justify-center py-5"
                >
                  {page}
                </Button>
              </Link>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <Button
            variant="secondary"
            onClick={() =>
              currentPage < totalPages &&
              navigate(`/phones/${currentPage + 1}?limit=${itemsPerPage}`)
            }
            className="h-10 w-10 items-center justify-center py-5"
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
