import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateProfile } from "@/_types/CandidateProfile"
import { EducationFormData } from "@/_validations/education";
import { Button, Checkbox,  Field, Flex, Input,  Stack,  Text } from "@chakra-ui/react"
import { useState } from "react";
import { Controller, useController,  useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { EducationList } from "./EducationList";
import { EducationDegree } from "./EducationDegree";

interface EducationProps{
    candidate: CandidateProfile;
}


export const Education = ({ candidate }: EducationProps)=>{
    const { register, setValue, reset, control, handleSubmit, formState:{ errors, isSubmitting}, clearErrors ,watch} = useFormContext<EducationFormData>()
    const { serverErrors, handleServerError } = useServerErrors(watch);
    const [educationList, setEducationList] = useState(candidate.education);

    const enabled = useController({
        control: control,
        name: "currentlyStudying",
    });

    const onSubmit = async (data: EducationFormData)=>{
        const candidateId = candidate.id as string;
        
        try{

            const response = await getAPIClient().post("/candidate/education", {
                degree: data.degree[0],
                institution: data.institution,
                fieldOfStudy: data.fieldOfStudy,
                startDate: data.startDate,
                endDate: data.endDate,
                currentlyStudying: data.currentlyStudying,
            });
            setEducationList((prev) => [...prev, response.data.data])
            reset();
            setValue("degree", []);
            setValue("currentlyStudying", false);
            clearErrors();
            toast.success(response.data.message);
        }catch(error: any){
            handleServerError(error)
        }
    
    }

    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Escolaridade</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <EducationDegree />
                    <Field.Root invalid={!!errors.institution}>
                        <Field.Label>Instituição</Field.Label>
                        <Input {...register("institution")} placeholder="Nome da instituição"/>
                        <Field.ErrorText>{errors.institution?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="institution"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.fieldOfStudy}>
                        <Field.Label>Nome do curso</Field.Label>
                        <Input {...register("fieldOfStudy")} placeholder="Digite o nome do curso"/>
                        <Field.ErrorText>{errors.fieldOfStudy?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="fieldOfStudy"/>
                    </Field.Root>
                </Stack>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.startDate}>
                        <Field.Label>Data de início</Field.Label>
                        <Input {...register("startDate")} placeholder="Data de início" type="date"/>
                        <Field.ErrorText>{errors.startDate?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="startDate"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.endDate}>
                        <Field.Label>Data de término</Field.Label>
                        <Input {...register("endDate")} placeholder="Data de término" type="date"/>
                        <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="endDate"/>
                    </Field.Root>
                </Stack>
                <Field.Root mt="4">
                    <Controller
                        control={control}
                        name="currentlyStudying"
                        render={({ field }) => (
                            <Field.Root  invalid={!!errors.currentlyStudying} disabled={field.disabled}>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                                <Checkbox.Label cursor="pointer">Ainda cursando</Checkbox.Label>
                            </Checkbox.Root>
                            <Field.ErrorText>
                                {errors.currentlyStudying?.message}
                            </Field.ErrorText>
                            </Field.Root>
                        )}
                        />
                    </Field.Root>
                    <Button loading={isSubmitting} mt="4" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" alignSelf="flex-end" type="submit">Adicionar +</Button>
            </form>
            <EducationList educationList={educationList} setEducationList={setEducationList} />
        </Flex>
    )
    
}
