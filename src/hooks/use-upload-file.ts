/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useSaveImage } from "@/api/apiComponents";

export type UploadedFile = {
  key: string;
  appUrl: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);
  // const [url, setUrl] = React.useState<string>("url");

  const mutation = useSaveImage({});
  

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      // const url = await ImageControllerService.saveImage({ image: file });
      const formData = new FormData();
      formData.append("image", file);

      const url = await mutation.mutateAsync({
        body: formData as any,
      });

      const uploaded: UploadedFile = {
        key: file.name,
        appUrl: url,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
      };

      setUploadedFile(uploaded);
      onUploadComplete?.(uploaded);

      return uploaded;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0
          ? errorMessage
          : "Something went wrong, please try again later.";

      toast.error(message);
      onUploadError?.(error);

      return undefined;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadThing,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    return err.issues.map((issue) => issue.message).join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  toast.error(getErrorMessage(err));
}
