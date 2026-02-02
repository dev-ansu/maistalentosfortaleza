import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { getAPIClient } from "@/_services/apiClient";
import { ReportsTable } from "@/_components/Reports/ReportsTable";

export default function(){
  
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="4">
                    <Text fontSize="2xl" fontWeight="semibold">Denúncias feitas</Text>
                    <ReportsTable />
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);

    const meRequest = await api.get("/me");
    const candidate = meRequest.data.data;

    if(candidate.userType !== "candidate"){
        return {
            redirect:{
                destination: "/dashboard",
                permanent: false,
            }
        }
    }
    
    return{
        props:{
            
        }
    }
});