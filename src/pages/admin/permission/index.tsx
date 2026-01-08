import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import PermissionsTable from "../../../_components/Admin/Permission/PermissionsTable";

export default function(){
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Funções/papéis</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <PermissionsTable />
                </Flex>
            </Sidebar>
        </>
    );
}
