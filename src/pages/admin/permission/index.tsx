import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import RolesTable from "./_components/RolesTable";
import { CreateRoleModal } from "./_components/CreateRoleModal";

export default function(){
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Funções/papéis</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <RolesTable />
                </Flex>
            </Sidebar>
        </>
    );
}
