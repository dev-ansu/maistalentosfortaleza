import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { JobForm } from "./_components/JobForm";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVagaValidation, VagaFormData } from "@/_validations/vagas";
import { getAPIClient } from "@/_services/apiClient";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { ServerErrorsProvider } from "@/_context/ServerErrors/ServerErrorsProvider";

export default function({ states, city }: { states: StateProps[], city: CityProps}){

    const methods = useForm<VagaFormData>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(createVagaValidation),
        defaultValues:{
            benefits: [],
            requirements: [],
            isRemoteFriendly: false,
            location: "",
        }
    });
    
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
                            <JobForm states={states} city={city} />
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
        

    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;
    const city = {id: '123', name: 'Fortaleza', stateId:'123'}
    return{
        props:{
            states,       
            city,
        }
    }
});