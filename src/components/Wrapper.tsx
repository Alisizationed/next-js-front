'use client'
import { useSession } from "next-auth/react";
import LoadingElement from "./ui/loading-circle";

const Wrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { status } = useSession();

  if (status === "loading") return <LoadingElement />;

  return <>{children}</>;
};

export default Wrapper;