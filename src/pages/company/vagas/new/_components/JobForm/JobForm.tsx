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
import { useState } from "react";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";

interface Props{
    states: StateProps[];
    city: CityProps;
}

export const JobForm = ({ states, city }: Props)=>{
    const [jobId, setJobId] = useState<string | null>(null);
    const { handleSubmit } = useFormContext<VagaFormData>();
    const { handleServerError, clearAllErrors  } = useServerErrorsContext();
    
    const onSubmit = async (data: VagaFormData)=>{
        const {
            benefits,cityId,contractType,description,
            expiresAt,isRemoteFriendly,requirements,salary,
            stateId,tags,title,type,workload,workloadType,
            location,seniority
        } = data;
        try{
            const response = await getAPIClient().post("/vagas",{
                benefits,cityId,contractType,description,
                expiresAt,isRemoteFriendly,requirements,salary,
                stateId,tags,title,type,workload,workloadType,
                location,seniority
            });

            clearAllErrors();
            if(response.data.success == true) toast.success(response.data.message)
                

        }catch(error: any){
            console.log(error)
            handleServerError(error);
        }
    }
    
    return(
        <Flex w="full">
            
                <form  onSubmit={handleSubmit(onSubmit)} style={{ width:"100%"}}>

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
                        <Button mt="4" type="submit">Salvar rascunho</Button>
                        {jobId && 
                            <Button mt="4" type="submit" bg="button.cta">Publicar vaga</Button>
                        }
                    </Flex>
                </form>

        </Flex>
    )
}













