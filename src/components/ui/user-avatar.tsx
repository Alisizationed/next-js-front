'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useGetUserById } from "@/api-1/api1Components";
import LoadingElement from "./loading-circle";
import { Badge } from "./badge";

const UserAvatar = ({id, section}: {id: string; section: string}) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById({
    pathParams: { id: id },
  });

  if (!user) return <>User not found.</>;

  if (isLoading) return <LoadingElement />;

  if (isError) return <>Error</>;
    return ( <>
    <div className="my-8 flex w-full items-center justify-center gap-6">
            <Link href={`/user/${id}`}>
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={user?.picture} alt={user?.username} />
                <AvatarFallback>
                  {user?.firstName}
                  {user?.lastName}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2>{section}</h2>
                <Badge className="mt-2" variant="secondary">
                  {user?.username}
                </Badge>
              </div>
            </Link>
          </div>
    </> );
}
 
export default UserAvatar;