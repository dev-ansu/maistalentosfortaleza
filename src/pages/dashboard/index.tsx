import { SemCurriculo } from "@/_components/ui/SemCurriculo/Index";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { useAuthContext } from "@/_context/AuthContext";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Dashboard(){
    const { user } = useAuthContext();

    console.log(user);

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                {user?.userType == 'candidate' && !user.isSuperAdmin && 
                    <SemCurriculo />
                }
                <Flex>
                    <Text>Bem-vindo ao dashboard</Text>
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