/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import LoadingElement from "./loading-circle";
import { useGetCommentsPageableV2 } from "@/api/apiComponents";
import Comment from "./comment-user";
import CommentForm from "../CommentForm";

const CommentsSection = ({ recipeId }: { recipeId: number }) => {
  const {
    data: comments,
    isLoading,
    isError,
  } = useGetCommentsPageableV2({
    pathParams: { recipeId: recipeId },
    queryParams: {
      page: 0,
      size: 4,
    },
  });

  if (isLoading) return <LoadingElement />;

  if (isError) return <>Error</>;

  return (
    <>
      <CommentForm recipeId={recipeId} />
      <div className="space-y-6">
        {comments?.map((comment) => (
          <Comment key={`comment-${comment.id}`} comment={comment} />
        ))}
      </div>
    </>
  );
};

export default CommentsSection;
