import { useRouter } from "next/router";
import { Button } from "./button";

interface PaginationProps {
  pageActive: number;
  pageNumber: number;
}

const Pagination = ({ pageActive, pageNumber }: PaginationProps) => {
  const router = useRouter();
  const maxButtons = 5;
  let startPage = Math.max(pageActive - 2, 1);
  let endPage = startPage + maxButtons - 1;

  if (endPage > pageNumber) {
    endPage = pageNumber;
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex space-x-1">
      {pageActive > 1 && (
        <Button onClick={() => router.push(`recipe/page/${pageActive - 1}`)}>
          Prev
        </Button>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => router.push(`recipe/page/${page}`)}
          className={page === pageActive ? "bg-slate-800 text-white" : ""}
          aria-current={page === pageActive ? "page" : undefined}
        >
          {page}
        </Button>
      ))}
      {pageActive < pageNumber && (
        <Button onClick={() => router.push(`recipe/page/${pageActive + 1}`)}>
          Next
        </Button>
      )}
    </div>
  );
};

export default Pagination;
