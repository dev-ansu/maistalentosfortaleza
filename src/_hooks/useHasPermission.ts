import { PermissionProps, useAuthContext } from "@/_context/AuthContext";
import { useMemo } from "react";

export function useHasPermission() {
  const { user } = useAuthContext();
  
  const userPermissions = useMemo(() => {
    if (!user) return [];
    if (user.isSuperAdmin) return ["*"];

    return user.permissions.map(
      (p: { permission: PermissionProps}) => `${p.permission.module}.${p.permission.name}`
    );
  }, [user]);

  function hasPermission(required: string | string[]) {
    if (!user) return false;
    if (userPermissions.includes("*")) return true;

    const requiredArray = Array.isArray(required) ? required : [required];

    return requiredArray.some((perm) => userPermissions.includes(perm));
  }

  return { hasPermission, userPermissions };
}