"use client";

import { useAddComment } from "@/api/apiComponents";
import SubscribeButton from "./ui/subscribe-button";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextArea } from "./ui/textarea";
const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

const CommentForm = ({
  recipeId,
  parentCommentId,
}: {
  recipeId: number;
  parentCommentId?: number;
}) => {
  const mutation = useAddComment();
  const form = useAppForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value: { content } }: {value: {content: string}}) => {
      const comment = {
        content: content,
        recipeId,
        parentCommentId
      };

      await mutation.mutateAsync({
        body: comment,
      });
      form.reset();
    },
    validators: {
      onChange: ({ value }: {value: {content: string}}) => {
        const errors: { fields: Record<string, string> } = { fields: {} };
        if (!value.content) {
          errors.fields.content = "Content is required";
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
        <form.Field
          name="content"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A content is required"
                : value.length < 3
                  ? "Content must be at least 3 characters"
                  : undefined,
          }}
        >
          {(field) => <TextArea field={field} label="Content" />}
        </form.Field>

        <div className="flex w-80 justify-self-end pt-3 pb-3">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <SubscribeButton
                label={isSubmitting ? "Commenting..." : "Comment"}
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

export default CommentForm;

