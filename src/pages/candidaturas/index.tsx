import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Candidaturas(){
    return (
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex>
                    <Text>Em breve</Text>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    return{
        props:{
            
        }
    }
});