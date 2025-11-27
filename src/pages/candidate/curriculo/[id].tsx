import { Sidebar } from "@/_components/ui/sidebar/Index";
import Head from "next/head";
import { VerCurriculo } from "./_components/VerCurriculo";
import { CandidateProfile } from "@/_types/CandidateProfile";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";

export default function( { candidate }:{ candidate: CandidateProfile} ){
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Ver Curríulo</title>
            </Head>
            <Sidebar>
                <VerCurriculo candidate={candidate}/>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);
    const response = await api.get("/me");
    
    const user = response.data.data;

    // Se o usuário NÃO tem currículo → redireciona
    if (!user.candidate) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
        
    return{
        props:{
            candidate: user.candidate,
        }
    }
});