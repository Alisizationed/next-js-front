/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useSaveProfilePicture } from "@/api/apiComponents";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import LoadingElement from "@/components/ui/loading-circle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

let file: string | Blob | null = null;
const getFile = (files: Blob | null) => {
  file = files;
};

const AddProfilePicture = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const mutation = useSaveProfilePicture();

  const setProfilePicture = () => {
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }
    mutation.mutate({
      pathParams: { id: session?.user.keycloakId },
      body: formData as any,
    });
    router.push(`/user/${session?.user.keycloakId}`);
  };
  if (status == 'loading') return <LoadingElement />;
  if (status == 'unauthenticated') return <>Error</>;
  return (
    <>
      <FileUpload onChange={getFile} />
      <Button onClick={() => setProfilePicture()}>Set picture</Button>
    </>
  );
};

export default AddProfilePicture;
