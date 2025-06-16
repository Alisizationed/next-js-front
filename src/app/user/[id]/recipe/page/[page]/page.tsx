/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { useGetAllUserRecipesCount } from "@/api/apiComponents";
import { useGetAllUsersRecipesPageable } from "@/api/apiComponents";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import LoadingElement from "@/components/ui/loading-circle";
import Pagination from "@/components/ui/pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { use } from "react";

const AccountRecipesPage = ({
  params,
}: {
  params: Promise<{ id: string; page: number }>;
}) => {
  const resolvedParams = use(params);
  const size = 6;
  const pageActive = resolvedParams.page - 1;

  const { data: data1, isLoading: isLoading1, isError: isError1 } = useGetAllUserRecipesCount({
    pathParams: { id: resolvedParams.id ?? "" },
  });

  const { data, isLoading, isError } = useGetAllUsersRecipesPageable({
    pathParams: { id: resolvedParams.id ?? "" },
    queryParams: { offset: pageActive * size, limit: size },
  });

  if (!resolvedParams) return <>User not found.</>;

  if (isLoading || isLoading1) return <LoadingElement />;

  if (isError || isError1) return <>Error</>;

  const pageNumber: number = Math.ceil(Number(data1!) / Number(size));

  return (
    <>
      <UserAvatar id={resolvedParams.id} section="Recipes" />
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
      <Pagination pageActive={resolvedParams.page} pageNumber={pageNumber}/>
    </>
  );
};

export default AccountRecipesPage;
