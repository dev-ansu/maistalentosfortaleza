import { CandidateProps } from "@/_components/Admin/Usuarios/List/UsersTable";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { dateFormat } from "@/_utils/dateFormat";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

interface Application{
    id: string;
    status: string;
    appliedAt: Date;
    candidate: CandidateProps;
}
interface JobApplication{
    id: string;
    title: string;
    applications: Application[];
}

export default function({ applications }: { applications: JobApplication}){

    console.log(applications);

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Perfil</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Candidaturas</Text>
                    {applications.applications.map( application => (
                        <Flex key={application.id} direction="column" gap="2">
                            <Link href={`/candidate/curriculo/${application.candidate.id}`}>
                                <Flex gap="1.5" direction="column">
                                    <Text fontSize="2xl" fontWeight="bold">{application.candidate.user.name}</Text>
                                    <Text color="gray.300" display="flex" gap="1" alignItems="center">
                                    <FaCheckCircle /> {application.status}
                                    </Text>
                                    <Text color="gray.400" display="flex" gap="1" alignItems="center">
                                    </Text>
                                    <Text fontSize="sm" color="gray.400">Candidatou-se em: {dateFormat(application.appliedAt)}</Text>
                                </Flex>
                            </Link>

                            <Flex gap="4" justifyContent="space-between" alignItems="flex-end">
                                                  
                                                    
                        
                            </Flex>
        
                        </Flex>
                    ))}
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const { params } = ctx;
    const id = params?.jobId as string; // Extrai o id da URL
    const api = getAPIClient(ctx);

    try{
        const me = await api.get("/me");

        const user = me.data.data;

        if(user.userType !== "company"){
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                }
            }
        }

        const response = await api.get(`/vaga/${id}/applications`);
        const applications = response.data.data;

        if (!applications) {
            return {
                redirect: {
                    destination: "/company/vagas",
                    permanent: false,
                },
            };
        }

        return {
            props: {
                applications,
            },
        };
    }catch(error: any){
        console.error("Erro ao buscar candidaturas:", error);

        let errorMessage = "Erro ao carregar candidaturas";
        
        if (error.response?.status === 404) {
            errorMessage = "Vaga não encontrada";
        } else if (error.response?.status === 403) {
            errorMessage = "Você não tem permissão para acessar esta vaga";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        return {
            redirect: {
                destination: "/company/vagas",
                permanent: false,
            },
        };
    }
});