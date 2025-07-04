/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  image,
  icon,
  link,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  image?: string;
  icon?: React.ReactNode;
  link: string;
}) => {
  return (
    <Link href={link} className="block h-full">
      <div
        className={cn(
          "group/bento shadow-input flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-2 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
          className,
        )}
        key={`recipe-${link.split("/")[2]}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          {/* <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipe/images/v2/${image}`}
            alt="Recipe image"
            quality={50}
            width={600}
            height={450}
            priority={false}
            loading="lazy"
            className="h-full w-full object-cover"
          /> */}
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipe/images/v2/${image}`}
            alt="Recipe image"
            // quality={50}
            // width={600}
            // height={450}
            // priority={false}
            // loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 flex flex-col justify-between transition duration-200 group-hover/bento:translate-x-2">
          {icon && <div>{icon}</div>}
          <div className="mt-2 mb-2 text-center font-sans font-bold text-neutral-600 dark:text-neutral-200">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};
