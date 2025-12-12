import { useHasPermission } from "@/_hooks/useHasPermission";
import { ReactNode } from "react";


interface CanProps {
  permission: string | string[];
  children: ReactNode;
}

export function Can({ permission, children }: CanProps) {
  const { hasPermission } = useHasPermission();

  if (!hasPermission(permission)) return null;

  return <>{children}</>;
}