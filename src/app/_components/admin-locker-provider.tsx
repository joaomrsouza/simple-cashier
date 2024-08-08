"use client";

import React, { type ReactNode } from "react";

interface AdminLockerContextValue {
  locked: boolean;
  setLocked: (setter: (locked: boolean) => boolean) => void;
}

export const AdminLockerContext = React.createContext<AdminLockerContextValue>({
  locked: true,
} as AdminLockerContextValue);

interface AdminLockerProviderProps {
  children: ReactNode;
}

export function AdminLockerProvider(props: AdminLockerProviderProps) {
  const { children } = props;

  const [locked, setLocked] = React.useState(true);

  return (
    <AdminLockerContext.Provider value={{ locked, setLocked }}>
      {children}
    </AdminLockerContext.Provider>
  );
}
