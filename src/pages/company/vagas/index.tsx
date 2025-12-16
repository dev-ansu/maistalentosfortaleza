import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import VagasTable from "./_components/VagasTable";

export default function(){
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Vagas</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Link href="/company/vagas/new">
                        <Button direction="row" alignItems="center" justifyContent="center" gap="1"  variant="outline" size="sm">
                            <FiPlus /> Nova vaga
                        </Button>
                    </Link>
                    <VagasTable />
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
    
    return{
        props:{
                       
        }
    }
});