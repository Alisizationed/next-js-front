'use client';

import { useRef } from "react";
import { BentoGridItem } from "./bento-grid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetRecommendedRecipes } from "@/api/apiComponents";
import LoadingElement from "./loading-circle";

export const RecommendationSection = ({
  recipeId,
  title = "Recommended for You",
}: {
  title: string;
  recipeId: number;
}) => {
  const { data, isLoading, isError } = useGetRecommendedRecipes({
    pathParams: { id: recipeId, limit: 5 },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <LoadingElement />;
  if (isError) return <>Error</>;

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="relative my-12">
      <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-100">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll(-300)}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:scale-105 dark:bg-neutral-900"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-10 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data?.map((item, idx) => (
            <div key={idx} className="min-w-[300px] flex-shrink-0">
              <BentoGridItem
                key={`recipe-${item.id}`}
                title={item.title}
                image={item.image}
                link={`/recipe/${item.id}`}
                className="h-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(300)}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:scale-105 dark:bg-neutral-900"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
        </button>
      </div>
    </section>
  );
};
