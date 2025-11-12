import { groupServerErrors } from "@/utils/groupServerErrors";
import { useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { toast } from "react-toastify";

export function useServerErrors<T extends Record<string, any> = any>(
  watch?: UseFormWatch<T>
) {
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  function handleServerError(error: any) {
    // Agrupa os erros vindos do express-validator
    const grouped = groupServerErrors(error);
    if (Object.keys(grouped).length > 0) {
      setServerErrors(grouped);
    }
    
    // Erros de rede e outros
    if (error.response) {
      toast.error(error.response.data.message || "Erro do servidor.");
    } else if (error.request) {
      toast.error("Sem resposta do servidor.");
    } else {
      toast.error("Erro desconhecido.");
    }
  }

  // Remove erros de um campo específico
  function clearFieldError(field: string) {
    setServerErrors(prev => {
      if (!(field in prev)) return prev; // nada muda
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }

  // Limpa todos os erros
  function clearAllErrors() {
    setServerErrors({});
  }

  // 🧠 Observa mudanças nos campos do formulário e limpa erros automaticamente
  useEffect(() => {
    if (!watch) return;

    const subscription = watch((_, { name }) => {
      if (name && serverErrors[name]) {
        clearFieldError(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, serverErrors]);


  return { serverErrors, handleServerError, clearFieldError, clearAllErrors };
}