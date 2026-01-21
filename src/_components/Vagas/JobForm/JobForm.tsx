import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { VagaFormData } from "@/_validations/vagas"
import { Button, Flex } from "@chakra-ui/react"
import {  useFormContext } from "react-hook-form"
import { WorkloadTypeSelect } from "./WorkloadTypeSelect";
import { BasicData } from "./BasicData";
import { SalaryWorkloadAndLocation } from "./SalaryWorkloadAndLocation";
import { ContractTypeSelect } from "./ContractTypeSelect";
import { SenioritySelect } from "./SenioritySelect";
import { WorkModelSelect } from "./WorkModelSelect";
import { useCallback, useState } from "react";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { useRouter } from "next/navigation";

interface Props{
    states: StateProps[];
    city: CityProps;
    onSubmit: (data: VagaFormData)=> Promise<any>;
}

export const JobForm = ({ states, city, onSubmit}: Props)=>{
    const { handleSubmit } = useFormContext<VagaFormData>();
    const { handleServerError, clearAllErrors  } = useServerErrorsContext();
    const router = useRouter();

    const submit = useCallback(async (data: VagaFormData, event?: React.BaseSyntheticEvent) => {
        try {
                    const submitter = (event?.nativeEvent as SubmitEvent)
                ?.submitter as HTMLButtonElement;

            const action = submitter?.value; // "draft" | "publish"

            const payload = {
                ...data,
                isDraft: action !== "publish",
            };

            const response = await onSubmit(payload);
            clearAllErrors();
            if (response.data.success) {
                toast.success(response.data.message)
                router.push("/company/vagas");
            };
        } catch (error: any) {
            handleServerError(error);
        }
    }, [onSubmit]);

    return(
        <Flex w="full">
            
                <form  onSubmit={handleSubmit(submit)} style={{ width:"100%"}}>

                    <Flex gap="4" direction="column" w="full">

                        <BasicData states={states} city={city}  />
                        
                        <SalaryWorkloadAndLocation />
                        
                        <Flex gap="2" w="full" direction="column">

                            <Flex gap="2" w="full">

                                <ContractTypeSelect />
                            
                                <SenioritySelect />

                            </Flex>

                            <Flex gap="2" w="full">

                                <WorkloadTypeSelect />

                                <WorkModelSelect />
                                
                            </Flex>


                        </Flex>

                    </Flex>

                    <Flex gap="2">
                            <Button 
                            name="action"
                            value="draft"
                            mt="4" type="submit">Salvar rascunho</Button>
                            
                            <Button 
                            name="action"
                            value="publish"
                            mt="4" type="submit" bg="button.cta">Publicar vaga</Button>
                        
                    </Flex>
                </form>

        </Flex>
    )
}













