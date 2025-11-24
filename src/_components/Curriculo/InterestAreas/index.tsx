import { CandidateProfile } from "@/_types/CandidateProfile"
import { InterestAreas } from "@/_types/InterestArea";
import { Button, Flex, Text } from "@chakra-ui/react";
import { InterestAreaFormData, InterestAreasSelect } from "./InterestAreasSelect";
import { useState } from "react";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { useFormContext } from "react-hook-form";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";

interface InterestAreaProps{
    candidate: CandidateProfile;
    interestAreas: InterestAreas[];
}

export const InterestArea = ( { candidate, interestAreas }: InterestAreaProps )=>{
    const { register, setValue, reset, control, handleSubmit, formState:{ errors, isSubmitting}, clearErrors ,watch} = useFormContext<InterestAreaFormData>()
    const { serverErrors, handleServerError, clearAllErrors } = useServerErrors(watch);
    const [interestAreasList, setInterestAreasList] = useState(interestAreas ?? []);
    
        const onSubmit = async (data: InterestAreaFormData)=>{
            const candidateId = candidate.id as string;
            
            try{
                const response = await getAPIClient().post("/candidate/interest", {
                    id: data.id,
                });
                setInterestAreasList((prev) => [...prev, response.data.data])
                reset();
                setValue('id', []);
                clearErrors();
                clearAllErrors();
                toast.success(response.data.message);
            }catch(error: any){
                handleServerError(error)
            }
        
        }
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Áreas de interesse</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InterestAreasSelect interestAreas={interestAreas} />
                <Button loading={isSubmitting} mt="4" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" alignSelf="flex-end" type="submit">Adicionar +</Button>
            </form>
        </Flex>
    )
}