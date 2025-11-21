import { SemCurriculo } from "@/_components/ui/SemCurriculo/Index";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Dashboard(){

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <SemCurriculo />
                <Flex>
                    <Text>Bem-vindo ao dashboard</Text>
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