import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { createRoleValidation, RoleFormData } from "@/_validations/role.validation";
import { Button, CloseButton, Dialog, Field, Flex, Input, Portal, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { FiPlus } from "react-icons/fi"
import { toast } from "react-toastify";


export const CreateRoleModal = ({ load }: { load: ()=> Promise<void> })=>{
  const [open, setOpen] = useState(false)
  const { handleSubmit, register, formState: { errors, isSubmitting }, reset, watch } = useForm<RoleFormData>({
    mode: "onBlur",
    criteriaMode:"firstError",
    resolver: zodResolver(createRoleValidation)
  });
  const { serverErrors, handleServerError } = useServerErrors(watch);

  const onSubmit = async({name, description}: RoleFormData)=>{
      
      try{
          const response = await getAPIClient().post("/admin/roles", {
              name, description
          });
          toast.success(response.data.message);
          reset();
          load();
          setOpen(!open);
      }catch(error: any){
          handleServerError(error)
      }
}
  
  return (
    <>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <Button alignSelf="flex-start" variant="outline" size="sm">
            <FiPlus /> Função/papel
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Nova função/papel</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit(onSubmit)}>

                  <Flex direction="column" gap="2" w="full">
                    <Field.Root invalid={!!errors?.name || !!serverErrors?.name}>
                      <Field.Label>Função/papel</Field.Label>
                      <Input autoFocus {...register("name")} placeholder="Digite o nome da função/papel"/>
                      <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                      <ServerErrors serverErrors={serverErrors} field="name"/>
                      <Field.HelperText>Limite de 50 caracteres.</Field.HelperText>
                    </Field.Root>
                  
                    <Field.Root invalid={!!errors.description || !!serverErrors?.description}>
                        <Field.Label>Descrição</Field.Label>
                        <Textarea
                            placeholder="Escreva descrição sobre a função/papel..."
                            {...register("description")}
                        />
                        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="description"/>
                        <Field.HelperText>Limite de 250 caracteres.</Field.HelperText>
                    </Field.Root>
                  </Flex>

                  <Button mt="6" type="submit">Cadastrar</Button>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button type="button" variant="outline">Fechar</Button>
                </Dialog.ActionTrigger>
                
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}