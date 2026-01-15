import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { maxLettersRejectionReason, RejectionReasonFormData } from "@/pages/company/candidaturas/[jobId]";
import { Button, CloseButton, Drawer, Field, Portal, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";


export const RejectApplyDrawer = ({
    open,
    setOpen
}: { open: boolean, setOpen: (e: boolean) => void;}) => {
  const {handleSubmit, clearErrors, watch, reset, register,formState: { errors, isSubmitting}} = useFormContext<RejectionReasonFormData>();
  const rejectionReason = watch("rejectionReason");
  const countLetters = rejectionReason?.length ?? 0;
  const { handleServerError, serverErrors } = useServerErrors();
  const handleClose = (close: boolean)=>{
    if(rejectionReason?.trim() !== ""){
        if(window.confirm("Deseja realmente fechar a janela?")){
            setOpen(close);
            reset();
        }
    }else{
        setOpen(close);
        reset();
    }
    clearErrors();
  }

  const onSubmit = async(data: RejectionReasonFormData)=>{
    try{
        const response = await getAPIClient().post("/application/reject", data);
        const message = response.data.data.message;
        toast.success(message);
        reset();
        setOpen(false);
    }catch(error: any){
        handleServerError(error);
    }
  }
  return (
    <Drawer.Root open={open} onOpenChange={(e) => handleClose(e.open)}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Rejeição de candidatura</Drawer.Title>
            </Drawer.Header>
                <Drawer.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field.Root invalid={!!errors.rejectionReason || !!serverErrors.rejectionReason || !!serverErrors.applicationIds}>
                        <Field.Label>Digite um feedback para o candidato:</Field.Label>
                        <Textarea rows={10} size="lg" {...register("rejectionReason")} />
                        <Field.ErrorText>{errors.rejectionReason?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="rejectionReason" />
                        <ServerErrors serverErrors={serverErrors} field="applicationIds" />
                        <Field.HelperText color={countLetters >= maxLettersRejectionReason ? "red":""}>{countLetters}/{maxLettersRejectionReason}</Field.HelperText>
                    </Field.Root>
                    <Button loading={isSubmitting} type="submit" bg="button.cta" mt="4">Salvar</Button>
                </form>
                </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
