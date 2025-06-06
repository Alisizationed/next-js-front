"use client";

import React from "react";
import { use } from "react";
import { useGetRecipe } from "@/api/apiComponents";
import { staticComponents } from "@/components/editor/static-components";
import { createSlateEditor, PlateStatic } from "@udecode/plate";
import { staticPlugins } from "@/components/editor/static-plugins";
import Image from "next/image";
import { cn } from "@udecode/cn";
import Tags from "@/components/ui/tag";
import IngredientTable from "@/components/ui/ingredient-table";
import LoadingElement from "@/components/ui/loading-circle";

const RecipePage = ({ params }: { params: Promise<{ id: number }> }) => {
  const resolvedParams = use(params);
  const { data, isLoading, isError } = useGetRecipe({
    pathParams: { id: resolvedParams.id },
  });

  if (isLoading) return <LoadingElement/>;
  if (isError) return <>Error</>;

  const editor = createSlateEditor({
    value: JSON.parse(data?.contents),
    plugins: staticPlugins,
    
  });

  return (
    <div
      className={cn(
        "mx-auto grid max-w-5xl grid-cols-1 gap-y-4 pr-4 pl-4 text-sm md:text-lg",
      )}
    >
      <h1 className="text-2xl font-bold md:text-6xl dark:text-white">
        {data?.title}
      </h1>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipe/images/v2/${data?.image}`}
          alt="Recipe image"
          width={1600}
          height={900}
          quality={75}
          priority={false}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <IngredientTable ingredients={data?.ingredients} isEditable={false}/>
      <div>{data?.description}</div>
      <Tags tags={data?.tags} isEditable={false} />
      <PlateStatic editor={editor} components={staticComponents} />
    </div>
  );
};

export default RecipePage;
