import { Sidebar } from "@/_components/ui/sidebar/Index";
import { RemoveApplication } from "@/_components/Vagas/Apply/RemoveApplication";
import { useEnumsContext } from "@/_context/EnumsContext";
import { getAPIClient } from "@/_services/apiClient";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { ApplicationStatus } from "@/_types/Job";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { dateFormat } from "@/_utils/dateFormat";
import { Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { FiLoader, FiX } from "react-icons/fi";


interface CandidateApplications{
    id: string;
    appliedAt: Date;
    rejectionReason: string;
    status: ApplicationStatus;
    job: {
        company: CompanyProfile;
        id: string;
        title: string;
    }
}

export default function Candidaturas({ applications }: { applications: CandidateApplications[]}){
    const { enums } = useEnumsContext();
    const ApplicationStatus = enums?.ApplicationStatus;

    return (
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Text>{applications.length <= 0 && "Você ainda não se candidatou a uma vaga."}</Text>
                <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Candidaturas</Text>
                    {applications.length > 0 && 
                        <Flex w="full"  direction="column"> 
                            {applications.map( (application, index) => (
                                <Flex mt="4" key={application.id} direction="column" gap="2">
                                    <Flex gap="2" w="full" justifyContent="flex-start" alignItems="center" >
                                        <Flex w="full">
                                            <Link title="Ver currículo do candidato" href={`/company/vagas/${application.job.id}`}>
                                                <Flex gap="1.5" direction="column">
                                                    <Text fontSize="2xl" fontWeight="bold">{application.job.title}</Text>
                                                    <Text color="gray.300" display="flex" gap="1" alignItems="center">
                                                        {application.status == "rejected" && <FiX />}
                                                        {application.status == "accepted" && <FaCheckCircle />}
                                                        {application.status == "pending" && <FiLoader />}
                                                        {
                                                            ApplicationStatus?.filter( item => item.value == application.status)[0].label ?? application.status
                                                        }
                                                    </Text>
                                                    <Text color="gray.400" display="flex" gap="1" alignItems="center">
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.400">Candidatou-se em: {dateFormat(application.appliedAt)}</Text>
                                                </Flex>
                                            </Link>
                                        </Flex>
                                    </Flex>
        
                                    <Flex gap="4" justifyContent="space-between" alignItems="flex-end">
                                        {application.status == "rejected" &&
                                            <Button size="xs" variant="ghost">Ver feedback</Button>
                                        }
                                        {
                                            application.status != "rejected" &&
                                            <RemoveApplication jobId={application.job.id}  />
                                        }
                                
                                    </Flex>
                
                                </Flex>
                            ))}
                    </Flex>
                    }
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    
    const api = getAPIClient(ctx);
    const response = await api.get("/candidate/me");
    
    const user = response.data.data;

    if(user.userType != 'candidate'){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }

    const applicationsRequest = await api.get("/candidate/applications");
    const applications = applicationsRequest.data.data;

    return{
        props:{
            applications,
        }
    }
});