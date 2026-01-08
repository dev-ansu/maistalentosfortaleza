import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Tabs, Text, useBreakpointValue } from "@chakra-ui/react";
import Head from "next/head";
import { FaBuilding } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { Company } from "../../_components/Company/Company";

interface Props{
    company: CompanyProfile;
}

export default function({company}: Props){

    const orientation = useBreakpointValue<"horizontal" | "vertical">({
        base: "vertical",
        md: "horizontal",
    });

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" w="full" gap="4" alignItems="center" justifyContent="center">
                    <Tabs.Root 
                    variant="subtle"
                    orientation={orientation}
                    w="full" 
                    defaultValue="Informações da empresa">
                    <Tabs.List w={{ md:"full" }}>
                        <Tabs.Trigger w="full" textAlign="center" title="Informações da empresa" value="Informações da empresa">
                            <FaBuilding />
                            <Text display={{ base:"none", md:"block" }}>Empresa</Text>
                        </Tabs.Trigger>
                        <Tabs.Trigger w="full" textAlign="center" title="Vagas" value="Vagas">
                            <FiBriefcase />
                            <Text display={{ base:"none", md:"block" }}>Vagas</Text>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content w="full" overflow="hidden" value="Informações da empresa">
                        <Company company={company} />
                    </Tabs.Content>
                    <Tabs.Content w="full" overflow="hidden" value="Vagas">
                       Vagas
                    </Tabs.Content>
                    </Tabs.Root>
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const { params } = ctx;
    const id = params?.id as string; // Extrai o id da URL
    const api = getAPIClient(ctx);
    const response = await api.get(`/company/${id}/profile`); 
    const company = response.data.data;
    
    return{
        props:{
            company: company,            
        }
    }
});