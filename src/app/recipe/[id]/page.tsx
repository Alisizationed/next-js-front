"use client";

import React from "react";
import { use } from "react";
import { useGetRecipe } from "@/api/apiComponents";
import { staticComponents } from "@/components/editor/static-components";
import { createSlateEditor, PlateStatic } from "@udecode/plate";
import { staticPlugins } from "@/components/editor/static-plugins";
import Image from "next/image";
import { cn } from "@udecode/cn";

const RecipePage = ({ params }: { params: Promise<{ id: number }> }) => {
  const resolvedParams = use(params); // Unwrap the promise using React.use()
  const { data, isLoading, isError } = useGetRecipe({
    pathParams: { id: resolvedParams.id },
  });

  if (isLoading) return <>Loading</>;
  if (isError) return <>Error</>;

  const editor = createSlateEditor({
    value: JSON.parse(data.contents),
    plugins: staticPlugins,
  });

  return (
    <div className={cn("mx-auto grid max-w-6xl grid-cols-1 pr-4 pl-4 text-sm md:text-lg gap-y-4")}>
      <h1 className="text-2xl md:text-6xl font-bold dark:text-white">
        {data.title}
      </h1>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipe/images/v2/${data.image}`}
          alt="Recipe image"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div>{data.description}</div>
      <PlateStatic editor={editor} components={staticComponents} />
    </div>
  );
};

export default RecipePage;
