import { AdminLockerContext } from "@/app/_components/admin-locker-provider";
import React from "react";

export function useAdminLocker() {
  const context = React.useContext(AdminLockerContext);

  if (!context) {
    throw new Error(
      "useAdminLocker must be used within an AdminLockerProvider",
    );
  }

  return context;
}
