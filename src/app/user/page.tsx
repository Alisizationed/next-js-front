/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import LoadingElement from "@/components/ui/loading-circle";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdTimestamp: number;
  enabled: boolean;
  totp: boolean;
  disableableCredentialTypes: [];
  requiredActions: [];
  notBefore: number;
  access: {
    manage: boolean;
  };
}

const fetchUserProfiles = async (): Promise<User[]> => {
  const usersUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
  const response = await fetch(usersUrl);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message ?? `Failed to get users: ${response.status}`);
  }

  const data: User[] = await response.json();
  return data;
};

const UserProfilesPage = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfiles()
      .then(setUsers)
      .catch((err) => {
        toast("You must be authenticated to see all users");
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!users) {
    return (
      <>
        <LoadingElement />
      </>
    );
  }

  return (
    <div>
      {users.length === 0 ? (
        <div>No users found</div>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfilesPage;
