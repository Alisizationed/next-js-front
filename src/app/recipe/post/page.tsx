/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { TextArea } from "@/components/ui/textarea";
import { useState } from "react";
import Tags from "@/components/ui/tag";
import IngredientTable from "@/components/ui/ingredient-table";
import type { IngredientDTO } from "@/api/apiSchemas";
import { useSession } from "next-auth/react";
import RecipePopup from "@/components/ui/recipe-popup";

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

const Page = () => {
  const router = useRouter();
  const editor = useCreateEditor();
  const session = useSession();
  const mutation = useSaveRecipe();
  const [tags, setTags] = useState<{ id: number; tag: string }[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value: { title, description } }) => {
      const recipe = {
        keycloakId: session.data?.user.keycloakId,
        image: "",
        title: title,
        description: description,
        contents: JSON.stringify(editor?.children ?? []),
        tags: tags,
        ingredients: ingredients.filter(
          (ingredient) =>
            ingredient.amount != null &&
            ingredient.measure != "" &&
            ingredient.ingredient != "",
        ),
      };

      const formData = new FormData();
      formData.append("image", file!);
      formData.append("body", JSON.stringify(recipe));

      await mutation.mutateAsync({
        body: formData as any,
      });
      router.push("/recipe/page/1");
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
        if (
          ingredients.filter(
            (ingredient) =>
              ingredient.amount != null &&
              ingredient.measure != "" &&
              ingredient.ingredient != "",
          ).length == 0
        ) {
          toast("Error: ingredients are required.");
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
      >
        <div className="flex justify-center py-4">
          <RecipePopup triggerText="Open others" title="Recipe">
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
              {(field) => <TextArea field={field} label="Description" />}
            </form.Field>
            <Tags tags={tags} setTags={setTags} isEditable={true} />
            <IngredientTable
              ingredients={ingredients}
              setIngredients={setIngredients}
              isEditable={true}
            />
          </RecipePopup>
        </div>
        <div className="h-screen w-full pt-4 pb-4">
          <SettingsProvider>
            <PlateEditor editor={editor} />
          </SettingsProvider>
          <Toaster />
        </div>
        <div className="flex w-80 justify-self-center pb-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <SubscribeButton
                label={isSubmitting ? "Posting..." : "Post"}
                form={form}
                // disabled={!canSubmit || isSubmitting}
              />
            )}
          </form.Subscribe>
        </div>
      </form>
    </>
  );
};

export default Page;
