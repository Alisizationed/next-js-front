"use client";

import { useGetAllUsersPageable, useGetUserCount } from "@/api-1/api1Components";
import LoadingElement from "@/components/ui/loading-circle";
import Pagination from "@/components/ui/pagination";
import UsersList from "@/components/ui/users-list";
import { use } from "react";

const UserProfilesPage = ({ params }: { params: Promise<{ page: number }> }) => {
  const resolvedParams = use(params);
  const size = 6;
  const page = resolvedParams.page;
  const { data: data1, isLoading: isLoading1, isError: isError1 } = useGetUserCount({
    queryParams: { offset: (page - 1)*size, limit: size },
  });
  const { data, isLoading, isError } = useGetAllUsersPageable({
    queryParams: { offset: (page - 1)*size, limit: size },
  });

  if (isLoading || isLoading1) {
    return <LoadingElement />;
  }

  if (isError || isError1) {
    return <div>Error appeared while fetching users</div>;
  }

  const pageNumber: number = Math.ceil(Number(data1!) / Number(size));

  return (
    <div>
      {data1 === 0 ? (
        <div>No users found</div>
      ) : (
        <UsersList users={data ?? []}/>
      )}
      <Pagination pageActive={page} pageNumber={Number(pageNumber)} />
    </div>
  );
};

export default UserProfilesPage;
