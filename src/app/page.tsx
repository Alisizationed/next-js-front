/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useGetAllRecipesPageableV2 } from "@/api/apiComponents";
import { HeroParallax } from "@/components/ui/hero-parallax";
import LoadingElement from "@/components/ui/loading-circle";

export default function HomePage() {
  const { data, isLoading, isError } = useGetAllRecipesPageableV2({
    queryParams: { page: 0, size: 15 },
  });

  if (isLoading) return <LoadingElement />;
  if (isError) return <>Error</>;

  return (
    <HeroParallax
      products={data?.content?.map((item) => ({
        title: item.title,
        link: `/recipe/${item.id}`,
        thumbnail: item.image,
      }))}
    />
  );
}
