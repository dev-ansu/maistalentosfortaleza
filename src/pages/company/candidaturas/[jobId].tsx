import { CandidateProps } from "@/_components/Admin/Usuarios/List/UsersTable";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { ApplicationAction, ApplicationActionDrawer } from "@/_components/Vagas/Apply/ApplicationActionDrawer";
import { useEnumsContext } from "@/_context/EnumsContext";
import { maxLetters } from "@/_hooks/useCountLetters";
import { useShowFeedback } from "@/_hooks/useShowFeedback";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { dateFormat } from "@/_utils/dateFormat";
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { FiCheckSquare, FiLoader, FiSquare, FiX } from "react-icons/fi";
import z from "zod";
import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { ApplicationStatus } from "@/_types/Job";
import { ApplicationStatusComponent } from "@/_components/ui/ApplicationStatus/ApplicationStatus";
import { ChangeApplicationStatusFilter } from "@/_components/ui/ApplicationStatus/ChangeApplicationStatusFilter";

interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  rejectionReason: string;
  updatedAt: Date;
  createdAt: Date;
  candidate: CandidateProps;
}

interface JobInfo {
  id: string;
  title: string;
}

interface JobApplicationsResponse {
  job: JobInfo;
  applications: {
    data: Application[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

const applicationActionValidation = z.object({
  applicationIds: z.array(z.string()).min(1),
  action: z.enum(["reject", "accept"]),
  rejectionReason: z
    .string()
    .trim()
    .max(maxLetters)
    .optional(),
}).superRefine((data, ctx) => {
  if (data.action === "reject" && !data.rejectionReason) {
    ctx.addIssue({
      path: ["rejectionReason"],
      message: "Campo obrigatório",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type ApplicationActionFormData =
  z.infer<typeof applicationActionValidation>;

export default function ViewVagaApplications({ initialData }: { initialData: JobApplicationsResponse }) {
  const [open, setOpen] = useState(false);
  const { ShowFeedbackDialog, handleOpen } = useShowFeedback();
  const methods = useForm<ApplicationActionFormData>({
    criteriaMode: "all",
    mode: "all",
    defaultValues: {
      applicationIds: [],
      action: "reject",

    },
    resolver: zodResolver(applicationActionValidation)
  });
  const [selectAll, setSelectAll] = useState(false);
  const checkboxesRef = useRef<HTMLInputElement[]>([]);
  const countApplicationIds = methods.watch("applicationIds");
  const { enums } = useEnumsContext();
  const ApplicationStatusEnum = enums?.ApplicationStatus;

  // Estados para dados dinâmicos (pagination)
  const [job, setJob] = useState<JobInfo>(initialData.job);
  const [applications, setApplications] = useState<Application[]>(initialData.applications.data);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialData.applications.total);
  const [currentPage, setCurrentPage] = useState(initialData.applications.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.applications.totalPages);
  const [action, setAction] = useState<ApplicationAction>("reject");
  const { filters, updateFilter, resetFilters } = useTableFilters({
    initialFilters: {
      page: 1,
      status:"",
    },
  });

  // Filtrar aplicações não rejeitadas para seleção
  const validApplications = applications.filter(app => app.status !== "rejected" && app.status !== "accepted");

  async function loadApplications() {
    setLoading(true);

    const queryString = buildQueryParams({
      ...filters,
      pageSize: 10,
    });

    try {
      const api = getAPIClient();
      const response = await api.get(`/vaga/${job.id}/applications?${queryString}`);
      const data = response.data.data;

      setJob(data.job);
      setApplications(data.applications.data);
      setTotal(data.applications.total);
      setCurrentPage(data.applications.currentPage);
      setTotalPages(data.applications.totalPages);
    } catch (error) {
      console.error("Erro ao carregar aplicações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [filters.page, filters.status]);

  // Efeito para desmarcar todos os checkboxes quando applicationId estiver vazio
  useEffect(() => {
    if (countApplicationIds.length === 0) {
      setSelectAll(false);
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

  const handleDrawer = (applicationId: string) => {
    methods.setValue("applicationIds", [applicationId]);
    // Desmarcar todos os checkboxes do DOM
    checkboxesRef.current.forEach(checkbox => {
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    setOpen(true);
  };

  const handleDrawerSelect = (action: ApplicationAction) => {
    setAction(action);
    methods.setValue("action", action);
    setOpen(true);
  };

  const handleSelectApplications = (e: MouseEvent<HTMLInputElement>, applicationId: string) => {
    if (e.currentTarget.checked) {
      methods.setValue("applicationIds", [...methods.getValues("applicationIds"), applicationId]);
    } else {
      const values = methods.getValues("applicationIds").filter(item => item !== applicationId);
      methods.setValue("applicationIds", values);
    }
  };

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
      const allIds = validApplications.map(app => app.id);
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

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const handleReject = (id: string) => {
    setAction("reject");
    methods.setValue("action", "reject");
    handleDrawer(id);
  };

  const handleAccept = (id: string) => {
    setAction("accept");
    methods.setValue("action", "accept");
    handleDrawer(id)
  };

  const handleChangeApplicationStatus = (status: string) => {
    updateFilter('status', status);
    updateFilter('page', 1);
  };

  return (
    <>
      <Head>
        <title>Mais Talentos Fortaleza - Candidaturas</title>
      </Head>
      <Sidebar>
        {ShowFeedbackDialog}
        <FormProvider {...methods}>
          <ApplicationActionDrawer action={action} open={open} setOpen={setOpen} Load={loadApplications} />
        </FormProvider>

        <Flex w="full" direction="column">
          <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">
            Candidaturas
          </Text>
          <Text fontSize="3xl">Vaga: {job.title}</Text>

          {/* Controles de seleção */}
          <Flex mt="2" alignItems="center" mb="4">
            {validApplications.length > 0 && (
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
            )}

            {countApplicationIds.length > 0 && (
              <Text fontSize="sm" color="gray.500">
                {countApplicationIds.length} de {validApplications.length} selecionados
              </Text>
            )}
          </Flex>

          {countApplicationIds.length > 0 && (
            <Flex>
              <Button
                my="1"
                alignSelf="flex-start"
                onClick={() => handleDrawerSelect("reject")}
                size="xs"
                bg="transparent"
                outline="none"
                _hover={{ bg: "red.500", color: "white" }}
                color="red.500"
              >
                <FiX /> Rejeitar selecionados ({countApplicationIds.length})
              </Button>
              <Button
                my="1"
                alignSelf="flex-start"
                onClick={() => handleDrawerSelect("accept")}
                size="xs"
                bg="green.700"
                outline="none"
                _hover={{ bg: "green.600", color: "white" }}
                color="white"
              >
                <FiX /> Aceitar selecionados ({countApplicationIds.length})
              </Button>
            </Flex>
          )}

          {/* DataTable com custom rendering para manter checkboxes */}
          <Box mt="4">
            <DataTable
              resetFilters={resetFilters}
              filters={
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                  <Text>Filtre por status:</Text>
                  <ChangeApplicationStatusFilter handleChangeApplicationStatus={handleChangeApplicationStatus} />
                </Flex>
              }
              columns={[
                {
                  key: "candidate",
                  label: "Candidatos",
                  render: (application: Application, index: number) => (
                    <Flex direction="column" gap="2">
                      <Flex gap="2" w="full" justifyContent="flex-start" alignItems="center">
                        {application.status !== "rejected" && application.status !== "accepted"  && (
                          <input
                            ref={(el) => registerCheckboxRef(el, index)}
                            onClick={(e) => handleSelectApplications(e, application.id)}
                            type="checkbox"
                            defaultValue={`${application.id}`}
                            checked={countApplicationIds.includes(application.id)}
                            onChange={() => {}} // Handled by onClick
                          />
                        )}
                        <Flex w="full">
                          <Link
                            title="Ver currículo do candidato"
                            href={`/candidate/curriculo/${application.candidate.id}`}
                          >
                            <Flex gap="3" direction="column">
                              <Text fontSize="2xl" fontWeight="bold">
                                {application.candidate.user.name}
                              </Text>

                              <ApplicationStatusComponent status={application.status} />

                              <Text fontSize="sm" color="gray.400">
                                Candidatou-se em: {dateFormat(application.appliedAt)}
                              </Text>
                            </Flex>
                          </Link>
                        </Flex>
                      </Flex>

                      <Flex gap="4" justifyContent="space-between" alignItems="flex-end">
                        {application.status !== "rejected" && application.status !== "accepted" && (
                          <Flex>
                            <Button
                              onClick={() => handleReject(application.id)}
                              size="xs"
                              bg="transparent"
                              outline="none"
                              _hover={{ bg: "red.500", color: "white" }}
                              color="red.500"
                            >
                              <FiX /> Rejeitar candidatura
                            </Button>
                            <Button
                              onClick={() => handleAccept(application.id)}
                              size="xs"
                              bg="green.700"
                              outline="none"
                              _hover={{ bg: "green.600", color: "gray.100" }}
                              color="white"
                            >
                              <FiX /> Aceitar candidatura
                            </Button>
                          </Flex>
                        )}
                        {application.status === "rejected" && (
                          <Button
                            onClick={() => handleOpen(application.rejectionReason)}
                            size="xs"
                            variant="ghost"
                          >
                            Ver feedback
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  ),
                },
              ]}
              data={applications}
              loading={loading}
              total={total}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { params } = ctx;
  const jobId = params?.jobId as string;
  const api = getAPIClient(ctx);

  try {
    const me = await api.get("/me");
    const user = me.data.data;

    if (user.userType !== "company") {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    // Carrega primeira página no SSR
    const response = await api.get(`/vaga/${jobId}/applications`);
    const initialData = response.data.data;

    if (!initialData) {
      return {
        redirect: {
          destination: "/company/vagas",
          permanent: false,
        },
      };
    }

    return {
      props: {
        initialData,
      },
    };
  } catch (error: any) {
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