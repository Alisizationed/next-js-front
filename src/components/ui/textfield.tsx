/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import * as LabelPrimitive from "@radix-ui/react-label";

import type { FieldApi } from "@tanstack/react-form";

type TextFieldProps = {
  label?: string;
  field: FieldApi<any, any>;
};

const TextField = ({ label, field }: TextFieldProps) => {
//   const field = useFieldContext<string>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  return (
    <div className="space-y-1.5">
      <LabelPrimitive.Root
        htmlFor={field.name}
        className={cn(
          "text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
      >
        {label}
      </LabelPrimitive.Root>

      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        data-slot="input"
        aria-invalid={errors.length > 0}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground file:text-foreground selection:bg-primary selection:text-primary-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
        )}
      />

      {errors.map((error: any) => (
        <p key={error} className="text-sm text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};

export { TextField };
