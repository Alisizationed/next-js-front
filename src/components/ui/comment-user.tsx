import { useState } from "react";
import UserAvatarComment from "./user-avatar-comment";
import LoadingElement from "./loading-circle";
import { useGetUserById } from "@/api-1/api1Components";
import { Button } from "./button";
import CommentForm from "../CommentForm";
import type { CommentDTO } from "@/api/apiSchemas";

const formatDate = (dateArray: number[]): string => {
  if (!Array.isArray(dateArray) || dateArray.length < 6) return "Invalid date";

  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleString();
}


const Comment = ({ comment }: { comment: CommentDTO }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById({ pathParams: { id: comment?.keycloakId } });

  const [showReplyForm, setShowReplyForm] = useState(false);

  if (isLoading) return <LoadingElement />;
  if (isError) return <>Error</>;

  return (
    <div className="ml-0 md:ml-4">
      <div key={comment.id} className="flex items-start gap-4 mt-4">
        <UserAvatarComment user={user} />
        <div className="bg-muted w-full rounded-xl p-4">
          <div className="text-sm font-semibold">{user?.username}</div>
          <div className="text-muted-foreground text-sm">
            {formatDate(comment.createdAt)}
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>

          <Button
            variant="ghost"
            className="mt-2 text-xs"
            onClick={() => setShowReplyForm((prev) => !prev)}
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </Button>

          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                recipeId={comment.recipeId}
                parentCommentId={comment.id}
              />
            </div>
          )}
        </div>
      </div>

      {comment.children?.length > 0 && (
        <div className="ml-4">
          {comment.children.map((child) => (
            <Comment key={`comment-${child.id}`} comment={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
