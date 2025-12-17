import { ConfirmationScreen } from "@/_components/ui/ConfirmationScreen";
import { useState } from "react";


interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setOptions(null);
  };

  const handleCancel = () => {
    resolver?.(false);
    setOptions(null);
  };

  const ConfirmationDialog = options ? (
    <ConfirmationScreen
      isOpen
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmationDialog };
}
