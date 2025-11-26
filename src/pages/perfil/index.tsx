import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Perfil(){
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex w="full">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Dados da empresa</Text>
                </Flex>
            </Sidebar>
        </>
    )
}

