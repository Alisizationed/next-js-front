/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useGetAllRecipesCount, useGetAllRecipesPageable } from "@/api/apiComponents";
import LoadingElement from "@/components/ui/loading-circle";
import Pagination from "@/components/ui/pagination";
import { use } from "react";

const RecipeList = ({
  params,
}: {
  params: Promise<{ page: number }>;
}) => {
  const resolvedParams = use(params);
  const size = 6;
  const page = resolvedParams.page;

  const { data: data1, isLoading: isLoading1, isError: isError1 } = useGetAllRecipesCount({});


  const { data, isLoading, isError } = useGetAllRecipesPageable({queryParams: {page: page - 1, size: size}});

  if (isLoading || isLoading1)
    return (
      <LoadingElement/>
    );

  if (isError || isError1) return <>Error</>;
  
  const pageNumber: number = (data1! / size);

  return (
    <>
    <BentoGrid className="mx-auto max-w-4xl">
      {data?.map((item, i) => (
        <BentoGridItem
          key={`recipe-${item.id}`}
          title={item.title}
          image={item.image}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          link={`/recipe/${item.id}`}
        />
      ))}
    </BentoGrid>
    <Pagination pageActive={page} pageNumber={pageNumber}/>
    </>
  );
};

export default RecipeList;
