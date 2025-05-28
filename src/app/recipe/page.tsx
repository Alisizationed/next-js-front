'use client';

import { useQuery } from "@tanstack/react-query";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { RecipeControllerService, type RecipeDTO } from "@/services/openapi";

const RecipeList = () => {
  const { data, isLoading, isError } = useQuery<RecipeDTO[]>({
    queryKey: ["getAll"],
    queryFn: RecipeControllerService.getAllRecipes,
  });

  if (isLoading) return <>Loading</>;

  if (isError) return <>Error</>;
  
    return (
      <BentoGrid className="max-w-4xl mx-auto">
        {data?.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            image={item.image}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            link={`/recipe/${item.id}`}
          />
        ))}
      </BentoGrid>
    );

};

export default RecipeList;
