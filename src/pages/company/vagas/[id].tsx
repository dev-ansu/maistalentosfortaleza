import { Sidebar } from "@/_components/ui/sidebar/Index";
import { VagasProps } from "@/_components/Vagas/VagasTableCompany";
import { VisualizacaoVaga } from "@/_components/Vagas/VisualizacaoVaga";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";

export default function({ vaga }: { vaga: VagasProps}){

    console.log(vaga);

    
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Vagas</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <VisualizacaoVaga vaga={vaga} />
                </Flex>
            </Sidebar>
        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const { params } = ctx;
    const id = params?.id as string; // Extrai o id da URL
    const api = getAPIClient(ctx);
    const response = await api.get(`/vagas/${id}`); 
    const vaga = response.data.data;
    
    if(!vaga){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            }
        }
    }


    return{
        props:{
            vaga,            
        }
    }
});