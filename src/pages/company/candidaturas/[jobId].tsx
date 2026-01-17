import { CandidateProps } from "@/_components/Admin/Usuarios/List/UsersTable";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { RejectApplyDrawer } from "@/_components/Vagas/Apply/RejectApplyDrawer";
import { useEnumsContext } from "@/_context/EnumsContext";
import { maxLetters } from "@/_hooks/useCountLetters";
import { useShowFeedback } from "@/_hooks/useShowFeedback";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { dateFormat } from "@/_utils/dateFormat";
import { Button, Flex, Text, Box, Checkbox, Field, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { FiCheckSquare, FiLoader, FiSquare, FiX } from "react-icons/fi";
import z from "zod";

interface Application{
    id: string;
    status: string;
    appliedAt: Date;
    rejectionReason: string;
    candidate: CandidateProps;
}
interface JobApplication{
    id: string;
    title: string;
    applications: Application[];
}


const rejectionValidation = z.object({
    applicationIds: z.array(z.string()),
    rejectionReason: z.string().trim().nonempty({message: "Campo obrigatório"}).max(maxLetters, { message: `Máximo de ${maxLetters} caracteres.`})
});

export type RejectionReasonFormData = z.infer<typeof rejectionValidation>;

export default function({ applications }: { applications: JobApplication}){
    const [open, setOpen] = useState(false);
    const { ShowFeedbackDialog, handleOpen } = useShowFeedback();
    const methods = useForm<RejectionReasonFormData>({
        criteriaMode: "all",
        mode: "all",
        defaultValues:{
            applicationIds: [],
        },
        resolver: zodResolver(rejectionValidation)
    });
    const [selectAll, setSelectAll] = useState(false);
    const checkboxesRef = useRef<HTMLInputElement[]>([]);
    const countApplicationIds = methods.watch("applicationIds");
    const validApplications = applications.applications.filter( app => app.status !== "rejected" );
    const { enums } = useEnumsContext();
    const ApplicationStatus = enums?.ApplicationStatus;

    // Efeito para desmarcar todos os checkboxes quando applicationId estiver vazio
    useEffect(() => {
        if (countApplicationIds.length === 0) {
            // Resetar o estado de seleção geral
            setSelectAll(false);
            
            // Desmarcar todos os checkboxes do DOM
            checkboxesRef.current.forEach(checkbox => {
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
        }
    }, [countApplicationIds]);

    // Efeito para sincronizar selectAll com a lista atual
    useEffect(() => {
        if (validApplications.length > 0) {
            const allSelected = countApplicationIds.length === validApplications.length;
            setSelectAll(allSelected);
        }
    }, [countApplicationIds, validApplications.length]);

    const handleDrawer = (applicationId: string)=>{
        setOpen(true);
        methods.setValue("applicationIds", [applicationId]);
        // Desmarcar todos os checkboxes do DOM
        checkboxesRef.current.forEach(checkbox => {
            if (checkbox) {
                checkbox.checked = false;
            }
        });
    }

    const handleDrawerSelect = ()=>{
        setOpen(true);
    }

    const handleSelectApplications = (e: MouseEvent<HTMLInputElement>, applicationId: string)=>{
        if(e.currentTarget.checked){
            methods.setValue("applicationIds", methods.getValues("applicationIds") ? [...methods.getValues("applicationIds"), applicationId]:[applicationId]);
        }else{
            const values = methods.getValues("applicationIds").filter( item => item !== applicationId);
            methods.setValue("applicationIds", values);
        }
    }

    

    const handleSelectAll = () => {
        if (selectAll) {
            // Desmarcar todos
            methods.setValue("applicationIds", []);
            setSelectAll(false);
            
            // Desmarcar todos os checkboxes do DOM
            checkboxesRef.current.forEach(checkbox => {
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
        } else {
            // Marcar todos
            const allIds = validApplications.filter( app => app.status != "rejected").map(app => app.id);
            methods.setValue("applicationIds", allIds);
            setSelectAll(true);
            
            // Marcar todos os checkboxes do DOM
            checkboxesRef.current.forEach(checkbox => {
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    };


    const registerCheckboxRef = (el: HTMLInputElement | null, index: number) => {
        if (el) {
            checkboxesRef.current[index] = el;
        }
    };

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Candidaturas</title>
            </Head>
            <Sidebar>
               {ShowFeedbackDialog}
                <FormProvider {...methods}>
                    <RejectApplyDrawer open={open} setOpen={setOpen} />         
                </FormProvider>

                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Candidaturas</Text>
                    <Text fontSize="3xl">Vaga: {applications.title}</Text>
                     <Flex mt="2" alignItems="center" mb="4">
                        {applications.applications.some( item => item.status != "rejected") && 
                        <Button
                        onClick={handleSelectAll}
                        size="xs"
                        bg="transparent"
                        outline="none"
                        _hover={{ bg: "gray.100", color: "gray.800" }}
                        color="gray.600"
                        display="flex"
                        alignItems="center"
                        gap="2"
                        mr="4"
                        >
                            {selectAll ? <FiCheckSquare /> : <FiSquare />}
                            {selectAll ? "Deselecionar todos" : "Selecionar todos"}
                        </Button>
                        }
                        
                        {countApplicationIds.length > 0 && (
                            <Text fontSize="sm" color="gray.500">
                                {countApplicationIds.length} de {validApplications.length} selecionados
                            </Text>
                        )}
                    </Flex>

                    {countApplicationIds.length > 0 && (
                        <Button
                            my="1"
                            alignSelf="flex-start"
                            onClick={() => handleDrawerSelect()}
                            size="xs"
                            bg="transparent"
                            outline="none" 
                            _hover={{ bg:"red.500", color: "white" }}
                            color="red.500"
                        >
                            <FiX /> Rejeitar selecionados ({countApplicationIds.length})
                        </Button>
                    )}
                    {applications.applications.map( (application, index) => (
                        <Flex mt="4" key={application.id} direction="column" gap="2">
                            <Flex gap="2" w="full" justifyContent="flex-start" alignItems="center" >

                                {application.status != "rejected" &&
                                    <input ref={(el) => registerCheckboxRef(el, index)} onClick={(e) => handleSelectApplications(e, application.id)} type="checkbox" defaultValue={`${application.id}`} />
                                }
                                <Flex w="full">
                                    <Link title="Ver currículo do candidato" href={`/candidate/curriculo/${application.candidate.id}`}>
                                        <Flex gap="1.5" direction="column">
                                            <Text fontSize="2xl" fontWeight="bold">{application.candidate.user.name}</Text>
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
                                {application.status != "rejected" &&
                                    <Button
                                        onClick={() => handleDrawer(application.id)}
                                        size="xs" bg="transparent" outline="none" 
                                        _hover={{ bg:"red.500", color: "white" }} color="red.500">
                                        <FiX /> Rejeitar candidatura
                                    </Button>              
                                }            
                                {application.status === "rejected" && (
                                <Button
                                    onClick={() =>
                                        handleOpen(application.rejectionReason)
                                    }
                                    size="xs"
                                    variant="ghost"
                                    >
                                    Ver feedback
                                </Button>
                            )}
                        
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
        const me = await api.get("/candidate/me");

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