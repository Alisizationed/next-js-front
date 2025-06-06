"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useGetAllRecipes } from "@/api/apiComponents";
import LoadingElement from "@/components/ui/loading-circle";

const RecipeList = () => {
  const { data, isLoading, isError } = useGetAllRecipes({});

  if (isLoading)
    return (
      <LoadingElement/>
    );

  if (isError) return <>Error</>;

  return (
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
  );
};

export default RecipeList;
