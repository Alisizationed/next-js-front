/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";

import Image from "next/image";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import type { UserListRepresentationDTO } from "@/api-1/api1Schemas";

const isTrustedDomain = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost";
  } catch {
    return false;
  }
};

const UserListComponent = ({ user }: { user: UserListRepresentationDTO }) => {
  const router = useRouter();
  const pictureUrl = user.attributes?.picture?.[0];

  const showNextImage = pictureUrl && isTrustedDomain(pictureUrl);

  return (
    <div
      onClick={() => {
        router.push(`/user/${user.id}`);
      }}
      className="flex flex-col items-center justify-between rounded-xl p-4 hover:bg-neutral-50 md:flex-row dark:hover:bg-neutral-800"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="h-40 w-40 rounded-full overflow-hidden md:h-14 md:w-14">
          {showNextImage ? (
            <Image
              src={pictureUrl}
              alt={`User ${user.username} profile picture`}
              quality={50}
              width={600}
              height={600}
              priority={false}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={pictureUrl ?? "/placeholder.png"}
              alt={`User ${user.username} profile picture`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className="text-center font-medium text-neutral-800 md:text-left dark:text-neutral-200">
            {user.username}
          </h3>
        </div>
      </div>
      <Button className="mt-4 cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-gray-500 hover:text-white md:mt-0">
        {`Go to ${user.username} profile`}
      </Button>
    </div>
  );
};

const UsersList = ({ users }: { users: UserListRepresentationDTO[] }) => {
  return (
    <ul className="mx-auto w-full max-w-2xl gap-4">
      {users.map((user) => (
        <UserListComponent key={user.id} user={user} />
      ))}
    </ul>
  );
};

export default UsersList;
