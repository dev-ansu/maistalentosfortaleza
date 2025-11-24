import { ZodError } from "zod";

type ServerErrorItem = { msg?: string; message?: string; param?: string; path?: string };

export const groupServerErrors = (err: any): Record<string, string[]> => {
  // tenta extrair o "payload" que contém os erros (padrão express-validator: { errors: [...] })
  const payload =
    err?.response?.data ?? // axios error with response body
    err?.errors ??         // maybe already an object with errors
    err;                   // fallback (maybe an array or zod error)

  // Se payload for array (express-validator geralmente manda array)
  if (Array.isArray(payload)) {
    return payload.reduce((acc: Record<string, string[]>, item: ServerErrorItem) => {
      const key = (item.param ?? item.path ?? "global") as string;
      const message = (item.msg ?? item.message ?? "Erro") as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(message);
      return acc;
    }, {});
  }

  // Se payload é um objeto com campo `errors` que é array
  if (payload && Array.isArray(payload.errors)) {
    return payload.errors.reduce((acc: Record<string, string[]>, item: ServerErrorItem) => {
      const key = (item.param ?? item.path ?? "global") as string;
      const message = (item.msg ?? item.message ?? "Erro") as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(message);
      return acc;
    }, {});
  }

  // Se o payload for um objeto com structure { field: ["msg1", "msg2"], ... } já agrupado
  if (payload && typeof payload === "object") {
    // detecta mapa de campo -> array (já agrupado)
    const isGrouped = Object.values(payload).every(v => Array.isArray(v));
    if (isGrouped) return payload as Record<string, string[]>;
  }

  // fallback: se existe mensagem simples
  if (payload && (payload.message || payload.msg)) {
    return { global: [payload.message ?? payload.msg ?? "Erro"] };
  }

  // nada encontrado
  return {};
};