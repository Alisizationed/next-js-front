/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useGetUserById } from "@/api-1/api1Components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import LoadingElement from "@/components/ui/loading-circle";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useSession } from "next-auth/react";

const UserProfilePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserById({
    pathParams: { id: resolvedParams.id },
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  if (isError) {
    return (
      <div>Error appeared while fetching user with id: {resolvedParams.id}</div>
    );
  }

  if (isLoading) {
    return <LoadingElement />;
  }

  if (!user) {
    return <div>No user with such id: {resolvedParams.id}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={user.picture} alt={user.username} />
              <AvatarFallback>
                {user.firstName}
                {user.lastName}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge className="mt-2" variant="secondary">
                {user.username}
              </Badge>
            </div>
          </div>
          <CardContent className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Biography</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {user.bio}
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="default"
                onClick={() => router.push(`/user/${user.id}/recipe/page/1`)}
                className="cursor-pointer"
              >
                View Recipes
              </Button>
              <Button
                variant="default"
                onClick={() => router.push(`/user/${user.id}/favourite/1`)}
                className="cursor-pointer"
              >
                View Favourites
              </Button>
              {session?.user.keycloakId == resolvedParams.id && (
                <Button
                  variant="link"
                  onClick={() => router.push(`/user/${user.id}/picture`)}
                  className="cursor-pointer"
                >
                  Set Profile Picture
                </Button>
              )}
              {session?.user.keycloakId == resolvedParams.id && (
                <Button
                  variant="link"
                  onClick={async () => {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`,
                      );
                      const data = await res.json();
                      router.push(data);
                  }}
                  className="cursor-pointer"
                >
                  Change Accounts Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
