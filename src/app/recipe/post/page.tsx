/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import * as React from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "@/components/ui/textfield";
import SubscribeButton from "@/components/ui/subscribe-button";
import { FileUpload } from "@/components/ui/file-upload";
import { useSaveRecipe } from "@/api/apiComponents";
import { useSession } from "next-auth/react";

const { fieldContext, formContext } = createFormHookContexts();
let file: string | Blob | null = null;

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

const getFile = (files: Blob | null) => {
  file = files;
};

export default function Page() {
  const router = useRouter();
  const session = useSession();

  const mutation = useSaveRecipe();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value: { title, description } }) => {
      const recipe = {
        title: title,
        description: description,
        // content: 
      };

      const formData = new FormData();
      formData.append("image", file!);
      formData.append("body", JSON.stringify(recipe));
      await mutation.mutateAsync({
        headers: { Authorization: `Bearer: ${session.data?.accessToken}` },
        body: formData as any,
      });
      router.push("/recipe/post");
    },
    validators: {
      onChange: ({ value }) => {
        const errors: { fields: Record<string, string> } = { fields: {} };
        if (!value.title) {
          errors.fields.title = "Title is required";
        }
        if (!value.description) {
          errors.fields.description = "Description is required";
        }
        if (!file) {
          toast("Error: Image is required");
        }
        return errors;
      },
    },
  });

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
        className="flex w-80 flex-col gap-3 justify-self-center"
      >
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A title is required"
                : value.length < 3
                  ? "Title must be at least 3 characters"
                  : undefined,
          }}
        >
          {/* {(field) => <TextField field={field} />} */}
          {(field) => <TextField field={field} label="Title" />}
        </form.Field>
        <FileUpload onChange={getFile} />

        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A description is required"
                : value.length < 3
                  ? "Description must be at least 3 characters"
                  : undefined,
          }}
        >
          {/* {(field) => <TextField label="description" />} */}
          {(field) => <TextField field={field} label="Description" />}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <SubscribeButton
              label={isSubmitting ? "Submitting..." : "Submit"}
              form={form}
              // disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </form>
        <div className="h-screen w-full">
          <SettingsProvider>
            <PlateEditor />
          </SettingsProvider>
          <Toaster />
        </div>
    </>
  );
}
