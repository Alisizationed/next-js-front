/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";

import type { SlateElementProps } from "@udecode/plate";
import type { TCaptionElement } from "@udecode/plate-caption";
import type { TImageElement } from "@udecode/plate-media";
import Image from "next/image";

import { NodeApi, SlateElement } from "@udecode/plate";

import { cn } from "@/lib/utils";

function isTrustedDomain(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return "localhost".includes(hostname);
  } catch {
    return false; // invalid URL
  }
}

export function ImageElementStatic(
  props: SlateElementProps<TImageElement & TCaptionElement & { width: number }>,
) {
  const { align = "center", caption, url, width } = props.element;

  return (
    <SlateElement {...props} className="py-2.5">
      <figure className="group relative m-0 inline-block" style={{ width }}>
        <div
          className="relative max-w-full min-w-[92px]"
          style={{ textAlign: align }}
        >
          {isTrustedDomain(url) ? (
            <div
              className={cn(
                "w-full max-w-full cursor-default object-cover px-0",
                "rounded-sm",
              )}
            >
              <Image
                width={1200}
                height={675}
                quality={75}
                priority={false}
                loading="lazy"
                className="h-full w-full object-cover"
                alt={(props.attributes as any).alt ?? "image"}
                src={url}
              />
            </div>
          ) : (
            <img
              className={cn(
                "w-full max-w-full cursor-default object-cover px-0",
                "rounded-sm",
              )}
              alt={(props.attributes as any).alt ?? "image"}
              src={url}
            />
          )}

          {caption && (
            <figcaption className="mx-auto mt-2 h-[24px] max-w-full">
              {NodeApi.string(caption[0] as any)}
            </figcaption>
          )}
        </div>
      </figure>
      {props.children}
    </SlateElement>
  );
}
