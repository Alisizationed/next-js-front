"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useGetUserById } from "@/api-1/api1Components";
import LoadingElement from "./loading-circle";
import Link from "next/link";

const UserAvatarSmall = ({ id }: { id: string }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById({
    pathParams: { id },
  });

  if (isLoading) return <LoadingElement />;
  if (isError || !user)
    return (
      <Avatar className="h-8 w-8 border">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );

  return (
    <Link href={`/user/${id}`}>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full border">
        <AvatarImage src={user.picture} alt={user.username} />
        <AvatarFallback>{user.username?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatarSmall;
