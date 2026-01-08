import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import {VagasTable} from "./_components/VagasTable";
import { StateProps } from "@/_types/CandidateProfile";
import { useForm, FormProvider} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const searcValidate = z.object({
  stateId: z.array(z.uuid(), { message:"Escolha um estado."}).min(1, {message: "Escolha um estado."}),
  cityId: z.array(z.uuid().optional()).optional(),
});

export type SearchFormData = z.infer<typeof searcValidate>;

export default function({ states }: { states: StateProps[]}){
    const methods = useForm({
        resolver: zodResolver(searcValidate)
    });
    
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Vagas</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <FormProvider {...methods}>
                        <VagasTable states={states} />
                    </FormProvider>
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);

    const response = await api.get("/me");

    if(!response.data.data.candidate){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    
    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;

    return{
        props:{
            states,   
        }
    }
});