"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import type { UserPublicRepresentationDTO } from "@/api-1/api1Schemas";

const UserAvatarComment = ({ user }: { user: UserPublicRepresentationDTO }) => {
  if (!user) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Link href={`user/${user.id}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.picture} alt={user.username} />
        <AvatarFallback>
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatarComment;
