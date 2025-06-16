/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { useGetAllUsersRecipes } from "@/api/apiComponents";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import LoadingElement from "@/components/ui/loading-circle";
import UserAvatar from "@/components/ui/user-avatar";
import { use } from "react";

const AccountRecipesPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = use(params);

  const { data, isLoading, isError } = useGetAllUsersRecipes({
    pathParams: { id: resolvedParams.id ?? "" },
  });

  if (!resolvedParams) return <>User not found.</>;

  if (isLoading) return <LoadingElement />;

  if (isError) return <>Error</>;

  return (
    <>
      <UserAvatar id={resolvedParams.id} section="Recipes"/>
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

export default AccountRecipesPage;
