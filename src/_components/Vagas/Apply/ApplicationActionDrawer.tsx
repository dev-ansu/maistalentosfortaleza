import { ServerErrors } from "@/_components/ui/ServerErrors";
import { maxLetters, useCountLetters } from "@/_hooks/useCountLetters";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { ApplicationActionFormData } from "@/pages/company/candidaturas/[jobId]";
import { Button, CloseButton, Drawer, Field, Portal, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

export type ApplicationAction = "reject" | "accept";

export const ApplicationActionDrawer = ({
    open,
    setOpen,
    Load,
    action,
}: { action: ApplicationAction, Load: () => Promise<void>, open: boolean, setOpen: (e: boolean) => void;}) => {
  const {handleSubmit, clearErrors, watch, reset, register,formState: { errors, isSubmitting}} = useFormContext<ApplicationActionFormData>();
  const rejectionReason = watch("rejectionReason");
  const {countLetters, setCountLetters} = useCountLetters();
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

  const onSubmit = async(data: ApplicationActionFormData)=>{
    try{
        const endpoint =
          data.action === "reject"
        ? "/application/reject"
        : "/application/accept";

        const response = await getAPIClient().post(endpoint, data);
        const message = response.data.data.message;
        toast.success(message);
        reset();
        setOpen(false);
        await Load();
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
              <Drawer.Title>
              {action === "reject"
                ? "Rejeição de candidatura"
                : "Aceitação de candidatura"}
            </Drawer.Title>
            </Drawer.Header>
                <Drawer.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {action === "reject" && (
                      <Field.Root
                        invalid={!!errors.rejectionReason || !!serverErrors.rejectionReason}
                      >
                        <Field.Label>Digite um feedback para o candidato:</Field.Label>

                        <Textarea
                          rows={10}
                          size="lg"
                          {...register("rejectionReason", {
                            onChange: (e) => setCountLetters(e.target.value.length),
                          })}
                        />

                        <Field.ErrorText>{errors.rejectionReason?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="rejectionReason" />

                        <Field.HelperText
                          color={countLetters >= maxLetters ? "red" : ""}
                        >
                          {countLetters}/{maxLetters}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                    <Button
                      type="submit"
                      bg={action === "reject" ? "red.500" : "green.600"}
                      mt="4"
                      loading={isSubmitting}
                    >
                      {action === "reject" ? "Rejeitar" : "Aceitar"}
                  </Button>
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
