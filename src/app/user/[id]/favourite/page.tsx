"use client";

import { useGetUserById } from "@/api-1/api1Components";
import { useGetFavouriteRecipes } from "@/api/apiComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import LoadingElement from "@/components/ui/loading-circle";
import UserAvatar from "@/components/ui/user-avatar";
import Link from "next/link";
import { use } from "react";

const FavouriteRecipesList = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = use(params);
  const { data, isLoading, isError } = useGetFavouriteRecipes({
    pathParams: { id: resolvedParams.id },
  });

  if (!resolvedParams) return <>User not found.</>;

  if (isLoading) return <LoadingElement />;

  if (isError) return <>Error</>;

  return (
    <>
      <UserAvatar id={resolvedParams.id}/>
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
    </>
  );
};

export default FavouriteRecipesList;
