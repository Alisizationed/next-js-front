'use client';

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useGetAllRecipes } from "@/api/apiComponents";

const RecipeList = () => {
  const { data, isLoading, isError } = useGetAllRecipes({});

  if (isLoading) return <>Loading</>;

  if (isError) return <>Error</>;
  
    return (
      <BentoGrid className="max-w-4xl mx-auto">
        {data?.map((item, i) => (
          <BentoGridItem
            key={`recipe-${item.id}`}
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
