"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RecipePopup = ({
  triggerText = "Open Details",
  title = "Title",
  children,
}: {
  triggerText?: string;
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-6">
        <DialogTitle>{title}</DialogTitle>
        <div className="max-h-[80vh] space-y-4 overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipePopup;
