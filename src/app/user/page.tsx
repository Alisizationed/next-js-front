"use client";

import { useGetAllUsers } from "@/api-1/api1Components";
import LoadingElement from "@/components/ui/loading-circle";
import UsersList from "@/components/ui/users-list";

const UserProfilesPage = () => {
  const { data, isLoading, isError } = useGetAllUsers({});

  if (isError) {
    return <div>Error appeared while fetching users</div>;
  }

  if (isLoading) {
    return <LoadingElement />;
  }

  return (
    <div>
      {data?.length === 0 ? (
        <div>No users found</div>
      ) : (
        <UsersList users={data ?? []}/>
      )}
    </div>
  );
};

export default UserProfilesPage;
