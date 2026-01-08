import { Sidebar } from "@/_components/ui/sidebar/Index";
import Head from "next/head";
import { VerCurriculo } from "../../../_components/Curriculo/VerCurriculo/VerCurriculo";
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
    const { params } = ctx;
    const id = params?.id as string; // Extrai o id da URL
    const api = getAPIClient(ctx);
    const response = await api.get(`/candidate/${id}/profile`);

    const candidate = response.data.data;
    
    return{
        props:{
            candidate: candidate,
        }
    }
});