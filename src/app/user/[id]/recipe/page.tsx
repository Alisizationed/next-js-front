/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { useGetUserById } from "@/api-1/api1Components";
import { useGetAllUsersRecipes } from "@/api/apiComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import LoadingElement from "@/components/ui/loading-circle";
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
  const {
    data: user,
    isLoading: isLoading1,
    isError: isError1,
  } = useGetUserById({
    pathParams: { id: resolvedParams.id ?? "" },
  });

  if (!resolvedParams) return <>User not found.</>;

  if (isLoading || isLoading1) return <LoadingElement />;

  if (isError || isError1) return <>Error</>;

  return (
    <>
      <div className="my-8 flex w-full items-center justify-center gap-6">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={user?.picture} alt={user?.username} />
          <AvatarFallback>
            {user?.firstName}
            {user?.lastName}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2>Recipes</h2>
          <Badge className="mt-2" variant="secondary">
            {user?.username}
          </Badge>
        </div>
      </div>
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
