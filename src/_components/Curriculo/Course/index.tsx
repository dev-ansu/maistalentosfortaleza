import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateProfile } from "@/_types/CandidateProfile"
import { CourseFormData } from "@/_validations/course";
import { Button, Field, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { CourseList } from "./CourseList";

interface CourseProps{
    candidate: CandidateProfile;
}

export const Course = ( { candidate }: CourseProps )=>{
    const { handleSubmit, reset, register, formState:{ errors, isSubmitting }, watch } = useFormContext<CourseFormData>();
    const {serverErrors, handleServerError } = useServerErrors();
    const [courseList, setCourseList] = useState(candidate.courses);

    const onSubmit = async (data: CourseFormData)=>{
        const candidateId = candidate.id as string;
        
        try{
            const response = await getAPIClient().post("/candidate/course", {
                institution: data.institution,
                title: data.title,
                completionDate: data.completionDate,
                hours: data.hours
            });
            console.log(response)
            setCourseList((prev) => [...prev, response.data.data])
            reset();
            toast.success(response.data.message);
        }catch(error: any){
            handleServerError(error)
        }
    
    }

    return(
         <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Cursos</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.institution}>
                        <Field.Label>Instituição</Field.Label>
                        <Input {...register("institution")} placeholder="Nome da instituição"/>
                        <Field.ErrorText>{errors.institution?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="institution"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.title}>
                        <Field.Label>Nome do curso</Field.Label>
                        <Input {...register("title")} placeholder="Digite o nome do curso"/>
                        <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="title"/>
                    </Field.Root>
                    <Field.Root invalid={!!errors.hours}>
                        <Field.Label>Carga horária</Field.Label>
                        <Input {...register("hours")} placeholder="Digite a carga horária, ex.: 50, 64, 110..."/>
                        <Field.ErrorText>{errors.hours?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="hours"/>
                    </Field.Root>
                </Stack>
                <Stack mt={{ md:"4" }} direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.completionDate}>
                        <Field.Label>Data de conclusão</Field.Label>
                        <Input {...register("completionDate")} placeholder="Data de conclusão" type="date"/>
                        <Field.ErrorText>{errors.completionDate?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="completionDate"/>
                    </Field.Root>
                </Stack>
                <Button loading={isSubmitting} mt="4" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" alignSelf="flex-end" type="submit">Adicionar +</Button>
            </form>
            <CourseList courseList={courseList} setCourseList={setCourseList} />
        </Flex>
    )
}