"use client";

import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConfirmDialogProps {
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => Promise<void> | void;
  open: boolean;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { children, onCancel: handleCancel, onConfirm, open } = props;
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = React.useCallback(async () => {
    setLoading(true);
    await onConfirm?.();
    setLoading(false);
  }, [onConfirm]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={handleCancel}>
            <XIcon className="mr-2 size-4" />
            Não
          </AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleConfirm}>
            {loading ? (
              <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
            ) : (
              <CheckIcon className="mr-2 size-4" />
            )}
            Sim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
