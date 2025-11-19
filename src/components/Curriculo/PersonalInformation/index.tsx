import { getAPIClient } from "@/services/apiClient";
import { PersonalInfoFormData } from "@/validations/curriculo";
import { Button, createListCollection, Field, Flex, Input, ListCollection, Portal, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { PersonalInformationProps } from "../../../pages/curriculo";
import { useServerErrors } from "@/hooks/useServerErrors";
import { ServerErrors } from "@/components/ui/ServerErrors";
import { toast } from "react-toastify";
import { ListStatesProps, StateItems } from "./states";
import { CitiesItems } from "./cities";



export const PersonalInformation = ({ states, candidate }: PersonalInformationProps)=>{
    const { register,handleSubmit, formState:{errors, isSubmitting}, watch} = useFormContext<PersonalInfoFormData>();
    const { serverErrors, handleServerError } = useServerErrors(watch);

    const newStates2 = states.map( state => {
        return {
            label: state.name,
            value: state.id,
        } as ListStatesProps;
    })
    const newStates = createListCollection({
        items: newStates2
    });

    const onSubmit = async (data: PersonalInfoFormData)=>{
        const stateId = data.stateId[0];
        const cityId  = data.cityId[0];
        
        try{

            const response = await getAPIClient().put("/candidate", {
                state: stateId,
                city: cityId,
                birthdate: data.birthdate,
                whatsapp: data.whatsapp,
                phone: data.phone,
                summary: data.summary
            });
           
            toast.success(response.data.message);
        }catch(error: any){
            handleServerError(error)
        }

    }

    return(
        <Flex direction="column"  w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Informações pessoais</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex gap="16px" direction="column">
                    <Stack>
                        <Field.Root invalid={!!errors.birthdate}>
                            <Field.Label>Data de nascimento</Field.Label>
                            <Input {...register("birthdate")} placeholder="Data de nascimento" type="date"/>
                            <Field.ErrorText>{errors.birthdate?.message}</Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="birthdate"/>
                        </Field.Root>
                    </Stack>
                    <Stack direction="row">
                        <Field.Root invalid={!!errors.whatsapp}>
                            <Field.Label>WhatsApp</Field.Label>
                            <Input {...register("whatsapp")} placeholder="Digite seu WhatsApp"/>
                            <Field.ErrorText>{errors.whatsapp?.message}</Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="whatsapp"/>
                        </Field.Root>
                        <Field.Root invalid={!!errors.phone}>
                            <Field.Label>Telefone</Field.Label>
                            <Input {...register("phone")} placeholder="Digite seu telefone" />
                            <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="phone"/>
                        </Field.Root>
                    </Stack>
                    
                    <Field.Root flexDir="row" w="full">
                        <StateItems states={newStates} candidate={candidate} />
                        <CitiesItems candidate={candidate} />
                    </Field.Root>
                

                    <Field.Root invalid={!!errors.summary}>
                            <Field.Label>Resumo</Field.Label>
                            <Textarea
                                placeholder="Eu sou..."
                                {...register("summary")}
                            />
                            <Field.HelperText>Escreva um resumo sobre você e suas qualificações.</Field.HelperText>
                            <Field.ErrorText>{errors.summary?.message}</Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="summary"/>
                    </Field.Root>
                    
                    <Button alignSelf="flex-start" type="submit" _hover={{ background: "orange.500"}} background="orange.400" >
                        Salvar Informações pessoais
                    </Button>
                </Flex>

            </form>
        </Flex>
    )
}





