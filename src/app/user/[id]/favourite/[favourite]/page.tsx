"use client";

import { useGetFavouriteCountByKeycloakId } from "@/api-1/api1Components";
import { useGetFavouriteRecipesPageable } from "@/api/apiComponents";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import LoadingElement from "@/components/ui/loading-circle";
import Pagination from "@/components/ui/pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { use } from "react";

const FavouriteRecipesList = ({
  params,
}: {
  params: Promise<{ id: string; favourite: number }>;
}) => {
  const resolvedParams = use(params);
  const size = 6;
  const { data, isLoading, isError } = useGetFavouriteRecipesPageable({
    pathParams: { id: resolvedParams.id },
    queryParams: { offset: (Number(resolvedParams.favourite) - 1)*size, limit: size },
  });
  const { data: data1, isLoading: isLoading1, isError: isError1 } = useGetFavouriteCountByKeycloakId({
    pathParams: { id: resolvedParams.id }
  });

  if (!resolvedParams) return <>User not found.</>;

  if (isLoading || isLoading1) return <LoadingElement />;

  if (isError || isError1) return <>Error</>;

  const pageNumber: number = Math.ceil(Number(data1!) / Number(size));

  return (
    <>
      <UserAvatar id={resolvedParams.id} />
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
      <Pagination pageActive={Number(resolvedParams.favourite)} pageNumber={pageNumber}/>
    </>
  );
};

export default FavouriteRecipesList;
