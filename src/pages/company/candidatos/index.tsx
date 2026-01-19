import { Sidebar } from "@/_components/ui/sidebar/Index";
import { USER_TYPES } from "@/_constants";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function(){
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Candidatos</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Candidatos</Text>
                    <Text>Em breve</Text>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);

    const response = await api.get("/me");
        
    const user = response.data.data;

    if (user.userType != USER_TYPES.company) {
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