import { Sidebar } from "@/_components/ui/sidebar/Index";
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

                </Flex>
            </Sidebar>
        </>
    )
}