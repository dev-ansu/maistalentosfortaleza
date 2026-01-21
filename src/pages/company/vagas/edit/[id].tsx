import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { JobForm } from "../../../../_components/Vagas/JobForm/JobForm";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVagaValidation, VagaFormData } from "@/_validations/vagas";
import { getAPIClient } from "@/_services/apiClient";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { ServerErrorsProvider } from "@/_context/ServerErrors/ServerErrorsProvider";

interface VagaProps extends Omit<VagaFormData, "contractType" | "seniority" | "cityId" | "stateId" | "workloadType" | "type">{
    id: string;
    city: CityProps;
    contractType: string;
    seniority: string;
    cityId: string;
    stateId: string;
    workloadType: string;
    type: string;
}
interface VagaFormD extends VagaFormData{
    isDraft: boolean;
}

export default function({ states, city, vaga }: { states: StateProps[], city: CityProps, vaga: VagaProps}){

    const methods = useForm<VagaFormData>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(createVagaValidation),
        defaultValues:{
            benefits: vaga.benefits,
            requirements: vaga.requirements,
            isRemoteFriendly: vaga.isRemoteFriendly,
            location: vaga.location,
            cityId: [vaga.cityId],
            stateId: [vaga.stateId],
            description: vaga.description,
            expiresAt: vaga.expiresAt
                ? new Date(vaga.expiresAt).toISOString().split("T")[0]
                : "",
            salary: String(vaga.salary),
            tags: vaga.tags,
            title: vaga.title,
            type: [vaga.type],
            workload: String(vaga.workload),
            contractType: [vaga.contractType],
            seniority: vaga.seniority ? [vaga.seniority]:[],
            workloadType: [vaga.workloadType]
        }
    });

    const onSubmit = async (data: VagaFormData)=>{
        
        const {
            benefits,cityId,contractType,description,
            expiresAt,isRemoteFriendly,requirements,salary,
            stateId,tags,title,type,workload,workloadType,
            location,seniority,isDraft
        } = data as VagaFormD;
        const response = await getAPIClient().put(`/vagas/${vaga.id}`,{
            isDraft,
            benefits,cityId,contractType,description,
            expiresAt,isRemoteFriendly,requirements,salary,
            stateId,tags,title,type,workload,workloadType,
            location,seniority
        });
        return response;
    }
    
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Nova vaga</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Nova vaga</Text>
                    <FormProvider {...methods}>
                        <ServerErrorsProvider<VagaFormData> watch={methods.watch} >
                            <JobForm jobIdValue={vaga.id} states={states} city={vaga.city} onSubmit={onSubmit} />
                        </ServerErrorsProvider>
                    </FormProvider>
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);
    
    const response = await api.get("/me");

    if(!response.data.data.company){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    
    const { params } = ctx;
    const id = params?.id as string; // Extrai o id da URL
    const requestVaga = await api.get(`/vagas/${id}`); 
    const vaga = requestVaga.data.data;
    
    if(!vaga){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            }
        }
    }

    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;
    const city = {id: '123', name: 'Fortaleza', stateId:'123'}
    return{
        props:{
            states,       
            city,
            vaga
        }
    }
});