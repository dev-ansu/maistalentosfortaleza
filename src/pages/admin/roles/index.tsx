import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import RolesTable from "./_components/RolesTable";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { getAPIClient } from "@/_services/apiClient";
import { canAccess } from "@/_utils/canAccess";
import { PermissionProps } from "@/_context/AuthContext";
import { PermissionsByModule } from "./_components/RolePermissionDrawer";


export default function({ permissions }:{ permissions:PermissionsByModule }){
    
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Funções/papéis</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <RolesTable permissions={permissions} />
                </Flex>
            </Sidebar>
        </>
    );
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const api = getAPIClient(ctx);
        
    const can = await canAccess(ctx,
        [
            'roles.list',
            'roles.view'
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
    const permissionsResponse = await api.get("/admin/list/all/permission")
    const permissions = permissionsResponse.data.data;

    return{
        props:{
            permissions,
            interestAreas,
        }
    }
});