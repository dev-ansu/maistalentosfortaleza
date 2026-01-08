import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { UsersTable } from "../../../../_components/Admin/Usuarios/List/UsersTable";
import { getAPIClient } from "@/_services/apiClient";
import { InterestAreas } from "@/_types/InterestArea";
import { canAccess } from "@/_utils/canAccess";

export default function({ interestAreas }: { interestAreas: InterestAreas[]}){
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <UsersTable interestAreas={interestAreas} />
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const api = getAPIClient(ctx);
        
    const can = await canAccess(ctx,
        [
            'user.list',
            'user.view'
        ]        
    );

    if(!can){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }

    const interestAreasResponse = await api.get("/interestAreas")
    const interestAreas = interestAreasResponse.data.data
    
    return{
        props:{
            interestAreas,
        }
    }
});