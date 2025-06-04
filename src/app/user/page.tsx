/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";

const UserProfilesPage = () => {
  const session = useSession();

  const getUserProfiles = async () => {
    const usersUrl = `https://localhost:8040/auth/admin/realms/recipe-app/users`;

    const accessToken = await fetch(usersUrl, {
      headers: {
        Authorization: `Bearer ${session.data?.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const response = await fetch(usersUrl, {
      headers: {
        Authorization: `Bearer ${session.data?.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to get users: ${JSON.stringify(data)}`);
    }

    console.log(data);
  };
  return <>
    
  </>;
};

export default UserProfilesPage;
