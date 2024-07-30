import React from "react";

export function useConfirmDialog(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  return {
    close,
    isOpen,
    open,
    set: setIsOpen,
  };
}
