"use client";

import { useAdminLocker } from "@/hooks/use-admin-locker";
import {
  ChevronDownIcon,
  KeyRoundIcon,
  LockIcon,
  UnlockIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { CheckPassDialog } from "./check-pass-dialog";
import { SetPassDialog } from "./set-pass-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AdminLocker() {
  const { locked, setLocked } = useAdminLocker();

  const [checkPassDialog, setCheckPassDialog] = React.useState(false);

  React.useEffect(() => {
    if (!locked) {
      // setCheckPassDialog(false);
      // TODO: dar um jeito nisso :facepalm:
      setTimeout(() => setCheckPassDialog(false), 0);
    }
  }, [locked]);

  const handleCorrectPass = React.useCallback(() => {
    // setCheckPassDialog(false);
    setLocked(() => false);
  }, [setLocked]);

  const handleWrongPass = React.useCallback(() => {
    toast.warning("Senha incorreta! Tente novamente!");
  }, []);

  const handleToggleAdminLock = React.useCallback(() => {
    setLocked(st => {
      if (!st) return true;

      setCheckPassDialog(true);
      return st;
    });
  }, [setLocked]);

  const [setPassDialog, setSetPassDialog] = React.useState(false);

  const handleUpdatePassClick = React.useCallback(() => {
    setSetPassDialog(true);
  }, []);

  return (
    <>
      <span>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-r-none"
          onClick={handleToggleAdminLock}
        >
          {locked ? (
            <LockIcon className="mr-2 size-4" />
          ) : (
            <UnlockIcon className="mr-2 size-4" />
          )}
          Visualização de administrador
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" className="rounded-l-none">
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUpdatePassClick}>
              <KeyRoundIcon className="mr-2 size-4" />
              Atualizar Senha
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
      <CheckPassDialog
        open={checkPassDialog}
        onWrongPass={handleWrongPass}
        onCorrectPass={handleCorrectPass}
        onOpenChange={setCheckPassDialog}
      />
      <SetPassDialog open={setPassDialog} onOpenChange={setSetPassDialog} />
    </>
  );
}
