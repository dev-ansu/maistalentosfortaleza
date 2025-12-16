import { createContext, useContext } from "react";

export type ServerErrors = Record<string, string[]>;

interface ServerErrorsContextData {
  serverErrors: ServerErrors;
  handleServerError: (error: any) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
}

export const ServerErrorsContext =
  createContext<ServerErrorsContextData | null>(null);

export function useServerErrorsContext() {
  const context = useContext(ServerErrorsContext);

  if (!context) {
    throw new Error(
      "useServerErrorsContext deve ser usado dentro de ServerErrorsProvider"
    );
  }

  return context;
}
