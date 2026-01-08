import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import { PendingCompaniesTable } from "../../../../_components/Admin/List/components/PendingCompaniesTable";
import { canAccess } from "@/_utils/canAccess";



export default function EmpresasPendentes(){
    return (
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="8">
                    <PendingCompaniesTable />
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{
    

    const can = await canAccess(ctx,
        [
            'company.list',
            'company.list.pending'
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
    
    // const api = getAPIClient(ctx);
    
    

    
    return{
        props:{
    
        }
    }
});