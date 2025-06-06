/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import { useGetRecipe, useUpdateRecipe } from "@/api/apiComponents";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { TextArea } from "@/components/ui/textarea";
import { use, useState, useEffect } from "react";
import Tags from "@/components/ui/tag";
import IngredientTable from "@/components/ui/ingredient-table";
import type { IngredientDTO } from "@/api/apiSchemas";
import { useSession } from "next-auth/react";
import { useGetKeycloakIdByEmail } from "@/api-1/api1Components";
import LoadingElement from "@/components/ui/loading-circle";

const { fieldContext, formContext } = createFormHookContexts();

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

const Page = ({
  params,
}: {
  params: Promise<{ id: string; recipe: number }>;
}) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const session = useSession();
  const mutation = useUpdateRecipe();
  const editor = useCreateEditor();
  const [tags, setTags] = useState<{ id: number; tag: string }[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [file, setFile] = useState<string | Blob | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: keycloakData } = useGetKeycloakIdByEmail({
    pathParams: { email: session.data?.user.email ?? "" },
  });

  const {
    data: recipe1,
    isLoading,
    isError,
  } = useGetRecipe({
    pathParams: { id: resolvedParams.recipe },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value: { title, description } }) => {
      const recipe = {
        keycloakId: keycloakData,
        image: recipe1?.image,
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
      if (file) {
        formData.append("image", file);
      }
      formData.append("body", JSON.stringify(recipe));

      await mutation.mutateAsync({
          body: formData as any,
          pathParams: {
              id: resolvedParams.recipe
          }
      });
      router.push(`/recipe/${resolvedParams.recipe}`);
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
        
        const validIngredients = ingredients.filter(
          (ingredient) =>
            ingredient.amount != null &&
            ingredient.measure != "" &&
            ingredient.ingredient != "",
        );
        
        if (validIngredients.length === 0) {
          toast.error("Error: ingredients are required.");
        }
        return errors;
      },
    },
  });

  const getFile = (files: Blob | null) => {
    setFile(files);
  };

  useEffect(() => {
    if (recipe1 && !isInitialized) {
      form.setFieldValue("title", recipe1.title ?? "");
      form.setFieldValue("description", recipe1.description ?? "");
      
      if (recipe1.contents && editor) {
        try {
          editor.children = JSON.parse(recipe1.contents);
        } catch (error) {
          console.error("Failed to parse recipe contents:", error);
        }
      }
      
      setIngredients(recipe1.ingredients ?? []);
      setTags(recipe1.tags ?? []);
      
      setIsInitialized(true);
    }
  }, [recipe1, editor, form, isInitialized]);

  if (isLoading) return <LoadingElement />;
  if (isError) return <div>Error loading recipe</div>;

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
      >
        <div className="flex w-80 flex-col gap-3 justify-self-center">
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
        </div>
        
        <IngredientTable
          ingredients={ingredients}
          setIngredients={setIngredients}
          isEditable={true}
        />
        
        <div className="h-screen w-full pt-4 pb-4">
          <SettingsProvider>
            <PlateEditor editor={editor} />
          </SettingsProvider>
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
      <Toaster />
    </>
  );
};

export default Page;