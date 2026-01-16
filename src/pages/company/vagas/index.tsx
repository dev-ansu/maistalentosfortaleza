import { Sidebar } from "@/_components/ui/sidebar/Index";
import { VagasTableCompany } from "@/_components/Vagas/VagasTableCompany";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Button, Flex } from "@chakra-ui/react";
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
                    <Link href="/company/vagas/new">
                        <Button direction="row" alignItems="center" justifyContent="center" gap="1"  variant="outline" size="sm">
                            <FiPlus /> Nova vaga
                        </Button>
                    </Link>
                    <VagasTableCompany />
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);

    const response = await api.get("/candidate/me");

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