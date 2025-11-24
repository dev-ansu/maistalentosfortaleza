import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CandidateProfile } from "@/_types/CandidateProfile"
import { LanguageFormData } from "@/_validations/language";
import { Button, Field, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { ProficiencySelect } from "./ProficiencySelect";
import { toast } from "react-toastify";
import { getAPIClient } from "@/_services/apiClient";
import { useState } from "react";
import { LanguageList } from "./LanguageList";

interface LanguageProps{
    candidate: CandidateProfile;
}

export const Language = ( { candidate }: LanguageProps )=>{
    const { register, setValue, reset, control, handleSubmit, formState:{ errors, isSubmitting}, clearErrors ,watch} = useFormContext<LanguageFormData>()
    const { serverErrors, handleServerError, clearAllErrors } = useServerErrors(watch);
    const [languageList, setLanguageList] = useState(candidate.languages ?? []);

    const onSubmit = async (data: LanguageFormData)=>{
            const candidateId = candidate.id as string;
            
            try{
                const response = await getAPIClient().post("/candidate/language", {
                    proficiency: data.proficiency[0],
                    name: data.name,
                });
                setLanguageList((prev) => [...prev, response.data.data])
                reset();
                setValue("proficiency", []);
                clearErrors();
                clearAllErrors();
                toast.success(response.data.message);
            }catch(error: any){
                handleServerError(error)
            }
        
        }
    
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Idiomas</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Field.Root invalid={!!errors.name || !!serverErrors.name}>
                        <Field.Label>Idioma</Field.Label>
                        <Input {...register("name")} placeholder="Idioma"/>
                        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="name"/>
                    </Field.Root>
                    <ProficiencySelect  />
                </Stack>
                <Button loading={isSubmitting} mt="4" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" alignSelf="flex-end" type="submit">Adicionar +</Button>
            </form>
            <LanguageList languageList={languageList} setLanguageList={setLanguageList} />
        </Flex>
    )
}