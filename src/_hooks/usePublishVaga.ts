import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { publishVaga } from "@/services/vagas/publishVaga";
import { useConfirm } from "./useConfirm";
import { useServerErrors } from "./useServerErrors";

export function usePublishVaga() {
  const [isLoading, setIsLoading] = useState(false);
  const { confirm, ConfirmationDialog } = useConfirm();
  const { handleServerError } = useServerErrors();

  const handlePublish = async (id: string) => {
    const accepted = await confirm({
      title: "Publicar vaga",
      message: "Tem certeza que deseja publicar esta vaga?",
      confirmText: "Publicar",
      cancelText: "Cancelar",
    });

    if (!accepted) return;

    setIsLoading(true);

    try {
      const response = await publishVaga(id);
      toast.success(response.message);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = JSON.parse(error.message);
        toast.error(message[0].message);
        return false;
      }

      handleServerError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePublish,
    isLoading,
    ConfirmationDialog,
  };
}
