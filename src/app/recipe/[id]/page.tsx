/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
import { RecommendationSection } from "@/components/ui/recommendation-section";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useIsFavourite, useSetIsFavourite } from "@/api-1/api1Components";
import UserAvatarSmall from "@/components/ui/user-avatar-small";
import CommentsSection from "@/components/ui/comments-section";
import { useDeleteRecipe } from "@/api/apiComponents";

const RecipePage = ({ params }: { params: Promise<{ id: number }> }) => {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading, isError } = useGetRecipe({
    pathParams: { id: resolvedParams.id },
  });
  const mutation = useDeleteRecipe();
  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
  } = useIsFavourite({
    pathParams: { id: session?.user.keycloakId ?? "", favourite: resolvedParams.id },
  });
  const setFavourite = useSetIsFavourite();

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (data1 !== undefined) {
      setIsFavourite(data1);
    }
  }, [data1]);

  if (isLoading || isLoading1 || status == "loading") return <LoadingElement />;
  if (isError || isError1) return <>Error</>;

  const editor = createSlateEditor({
    value: JSON.parse(data?.contents ?? ""),
    plugins: staticPlugins,
  });

  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

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
      <div className="flex justify-end gap-4">
        <Toggle
          aria-label="Toggle favourite"
          pressed={isFavourite}
          onPressedChange={async (pressed: boolean) => {
            setIsFavourite(pressed);
            try {
              await setFavourite.mutateAsync({
                pathParams: {
                  id: session?.user.keycloakId ?? "",
                  favourite: resolvedParams.id,
                },
                queryParams: { favouriteStatus: pressed },
              });
            } catch (error) {
              setIsFavourite(!pressed);
              console.error("Failed to update favourite status:", error);
            }
          }}
          className="cursor-pointer text-red-500"
        >
          <Heart className="h-4 w-4" />
        </Toggle>

        {session && session?.user.keycloakId === data?.keycloakId && (
          <Button
            onClick={async () => {
              await mutation.mutateAsync({
                pathParams: { id: resolvedParams.id },
              });
              router.push("/recipe/page/1");
            }}
            className="cursor-pointer"
          >
            Delete
          </Button>
        )}
        {session && session?.user.keycloakId === data?.keycloakId && (
          <Button
            onClick={() =>
              router.push(`/recipe/${data?.id}/update`)
            }
            className="cursor-pointer"
          >
            Update
          </Button>
        )}
        <UserAvatarSmall id={data?.keycloakId ?? ""} />
      </div>
      <IngredientTable ingredients={data?.ingredients ?? []} isEditable={false} />
      <div>{data?.description}</div>
      <Tags tags={data?.tags ?? []} isEditable={false} />
      <PlateStatic editor={editor} components={staticComponents} />
      <RecommendationSection
        title={"Recommended for you"}
        recipeId={data?.id ?? 0}
      />
      <CommentsSection recipeId={resolvedParams.id} />
    </div>
  );
};

export default RecipePage;
