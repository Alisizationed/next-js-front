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
    pathParams: { id: recipeId, size: 5 },
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
    <section className="relative my-12 group">
      <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-100">
        {title}
      </h2>

      <div className="relative">
        {/* Scroll Button Wrapper */}
        <div className="relative px-10">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll(-300)}
            className="absolute left-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-white text-neutral-700 transition hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 group-hover:flex"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll(300)}
            className="absolute right-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-white text-neutral-700 transition hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 group-hover:flex"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
        </div>
      </div>
    </section>
  );
};
