import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateProfile } from "@/_types/CandidateProfile"
import { Button, Checkbox,  Field, Flex, Input,  Stack,  Text, Textarea } from "@chakra-ui/react"
import { useState } from "react";
import { Controller, useController,  useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { ExperienceList } from "./ExperienceList";
import { ExperienceFormData } from "@/_validations/experience";

interface ExperienceProps{
    candidate: CandidateProfile;
}


export const Experience = ({ candidate }: ExperienceProps)=>{
    const { register, setValue, reset, control, handleSubmit, formState:{ errors, isSubmitting}, clearErrors ,watch} = useFormContext<ExperienceFormData>()
    const { serverErrors, handleServerError, clearAllErrors } = useServerErrors(watch);
    const [experienceList, setExperienceList] = useState(candidate.experiences ?? []);

    const enabled = useController({
        control: control,
        name: "currentlyWorking",
    });

    const onSubmit = async (data: ExperienceFormData)=>{
        const candidateId = candidate.id as string;
        
        try{

            const response = await getAPIClient().post("/candidate/experience", {
                company: data.company,
                position: data.position,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                currentlyWorking: data.currentlyWorking,
            });
            setExperienceList((prev) => [...prev, response.data.data])
            reset();
            setValue("currentlyWorking", false);
            clearErrors();
            clearAllErrors();
            toast.success(response.data.message);
        }catch(error: any){
            handleServerError(error)
        }
    
    }

    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Experiência</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.company || !!serverErrors.company}>
                        <Field.Label>Empresa</Field.Label>
                        <Input {...register("company")} placeholder="Nome da empresa"/>
                        <Field.ErrorText>{errors.company?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="company"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.position || !!serverErrors.position}>
                        <Field.Label>Cargo</Field.Label>
                        <Input {...register("position")} placeholder="Digite o nome do cargo"/>
                        <Field.ErrorText>{errors.position?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="position"/>
                    </Field.Root>
                </Stack>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.startDate || !!serverErrors.startDate}>
                        <Field.Label>Data de início</Field.Label>
                        <Input {...register("startDate")} placeholder="Data de início" type="date"/>
                        <Field.ErrorText>{errors.startDate?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="startDate"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.endDate || !!serverErrors.endDate}>
                        <Field.Label>Data de término</Field.Label>
                        <Input {...register("endDate")} placeholder="Data de término" type="date"/>
                        <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="endDate"/>
                    </Field.Root>
                </Stack>
                <Field.Root invalid={!!errors.description || !!serverErrors.description}>
                    <Field.Label>Resumo</Field.Label>
                    <Textarea
                        maxLength={250}
                        placeholder="Trabalhei 10 anos..."
                        {...register("description")}
                    />
                    <Field.HelperText>Escreva um pouco sobre o que você fazia nesta empresa e cargo e o que aprendeu. Limite de 250 caracteres.</Field.HelperText>
                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="description"/>
                </Field.Root>
                <Field.Root mt="4">
                    <Controller
                        control={control}
                        name="currentlyWorking"
                        render={({ field }) => (
                            <Field.Root  invalid={!!errors.currentlyWorking || !!serverErrors.currentlyWorking} disabled={field.disabled}>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                                <Checkbox.Label cursor="pointer">Trabalho aqui atualmente</Checkbox.Label>
                            </Checkbox.Root>
                            <Field.ErrorText>
                                {errors.currentlyWorking?.message}
                            </Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="currentlyWorking"/>
                            </Field.Root>
                        )}
                        />
                    </Field.Root>
                    <Button loading={isSubmitting} mt="4" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" alignSelf="flex-end" type="submit">Adicionar +</Button>
            </form>
            <ExperienceList experienceList={experienceList} setExperienceList={setExperienceList} />
        </Flex>
    )
    
}
