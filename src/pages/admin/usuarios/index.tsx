import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import UsersTable from "./_components/UsersTable";
import { getAPIClient } from "@/_services/apiClient";

export default function(){
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <UsersTable />
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const api = getAPIClient(ctx);
        
    const response = await api.get("/me");
    const user = response.data.data;

    if (!user.isSuperAdmin) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    
    return{
        props:{
            
        }
    }
});