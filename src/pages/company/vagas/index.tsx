import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function(){
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Vagas</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Minhas vagas</Text>
                    <Link href="/company/vagas/new">
                        <Button direction="row" alignItems="center" justifyContent="center" gap="1" bg="green.500" >
                            <FiPlus /> Nova vaga
                        </Button>
                    </Link>
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