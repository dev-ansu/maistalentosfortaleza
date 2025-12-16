import { ReactNode } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import { ServerErrorsContext } from "./ServerErrorsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";

interface Props<T extends FieldValues> {
  children: ReactNode;
  watch?: UseFormWatch<T>;
}

export function ServerErrorsProvider<T extends Record<string, any>>({
  children,
  watch,
}: Props<T>) {
  const serverErrorsState = useServerErrors<T>(watch);

  return (
    <ServerErrorsContext.Provider value={serverErrorsState}>
      {children}
    </ServerErrorsContext.Provider>
  );
}
