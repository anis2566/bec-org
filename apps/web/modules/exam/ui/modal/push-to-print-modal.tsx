"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  ButtonState,
  LoadingButton,
} from "@workspace/ui/shared/loadign-button";

import { usePushToPrintTask } from "@/hooks/use-document";
import { useRouter } from "next/navigation";

export const PushToPrintModal = () => {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [errorText, setErrorText] = useState<string>("");

  const { isOpen, documentId, onClose } = usePushToPrintTask();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: pushToPrint, isPending } = useMutation(
    trpc.document.pushToPrint.mutationOptions({
      onError: (err) => {
        setErrorText(err.message);
        setButtonState("error");
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          setButtonState("error");
          setErrorText(data.message);
          toast.error(data.message);
          return;
        }
        setButtonState("success");
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.document.getMany.queryKey(),
        });
        onClose();
        // router.push("/task/print");
      },
    })
  );

  const handlePush = () => {
    setButtonState("loading");
    pushToPrint(documentId);
  };

  return (
    <AlertDialog
      open={isOpen && !!documentId}
      onOpenChange={isPending ? () => {} : onClose}
    >
      <AlertDialogContent className="rounded-xs">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will push the document to print
            task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <LoadingButton
            type="submit"
            onClick={handlePush}
            loadingText="Updating..."
            successText="Updated!"
            errorText={errorText || "Failed"}
            state={buttonState}
            onStateChange={setButtonState}
            className="w-full md:w-auto"
            variant="default"
            icon={Send}
          >
            Update
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
