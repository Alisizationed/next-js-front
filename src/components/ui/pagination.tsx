"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface PaginationProps {
  pageActive: number;
  pageNumber: number;
}

const Pagination = ({ pageActive, pageNumber }: PaginationProps) => {
  const router = useRouter();
  const maxButtons = 5;
  let startPage = Math.max(pageActive - 2, 1);
  const endPage = Math.min(startPage + maxButtons - 1, pageNumber);

  if (endPage - startPage + 1 < maxButtons && pageNumber >= maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-1">
        {pageActive > 1 && (
          <Button onClick={() => router.push(`${Number(pageActive) - 1}`)}>
            Prev
          </Button>
        )}
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => router.push(`${page}`)}
            className={page === pageActive ? "bg-slate-800 text-white" : ""}
            aria-current={page === pageActive ? "page" : undefined}
          >
            {page}
          </Button>
        ))}
        {pageActive < pageNumber && (
          <Button onClick={() => router.push(`${Number(pageActive) + 1}`)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
