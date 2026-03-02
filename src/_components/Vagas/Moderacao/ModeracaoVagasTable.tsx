import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { dateFormat } from "@/_utils/dateFormat";
import {  Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { ReportStatusComponent, ReportStatusType } from "../../Reports/ReportStatusComponent";
import { ReportReasonComponent, ReportReasonType } from "../../Reports/ReportReasonComponent";
import { useShowFeedback } from "@/_hooks/useShowFeedback";
import { useConfirm } from "@/_hooks/useConfirm";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { useServerErrors } from "@/_hooks/useServerErrors";


interface Reports {
  id: string;
  jobId: string;
  reporterId: string;
  reason: ReportReasonType;
  description: string;
  status: ReportStatusType;
  reviewedById: string | null;
  reviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  job: {
      id: string;
        title: string;
        company: CompanyProfile;
        isBlocked: boolean;
  };
}



export function ModeracaoVagasTable() {
  const [reports, setReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleOpen, ShowFeedbackDialog } = useShowFeedback();
  const {ConfirmationDialog, confirm} = useConfirm();
  const { handleServerError } = useServerErrors();
  
  const { filters, updateFilter } = useTableFilters({
    initialFilters: {
      page: 1,
    },
  });

  async function load() {
    setLoading(true);

    const queryString = buildQueryParams({
      ...filters,
      pageSize: 10,
    });

    const res = await getAPIClient().get(
      `/admin/vagas/moderacao?${queryString}`
    );

    setReports(res.data.data.data);
    setTotal(res.data.data.total);
    setCurrentPage(res.data.data.currentPage);
    setTotalPages(res.data.data.totalPages);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters.page]);

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const resolved = (id?: string)=>{
    return getAPIClient().patch(`/admin/vagas/moderacao/resolved/${id}`);
  }

  const rejected = (id?: string)=>{
    return getAPIClient().patch(`/admin/vagas/moderacao/rejected/${id}`);
  }
  const underReview = (id?: string)=>{
    return getAPIClient().patch(`/admin/vagas/moderacao/under-review/${id}`);
  }

  const handleDesblock = (id?: string)=>{
      return getAPIClient().patch(`/admin/vagas/moderacao/desblock/${id}`);
  }

  const handle = async(fn: (id?: string) => Promise<AxiosResponse<any, any, {}>>, id: string)=>{
      type TranslateFnName = "rejected" | "resolved" | "underReview" | "handleDesblock";

      const texts = {
        rejected: {
          long: "marcar como rejeitada",
          short: "Rejeitada",
        },
        resolved:{
          long: "marcar como resolvida",
          short: "Resolvida"
        },
        underReview:{
          long: "revisar essa decisão",
          short: "Revisar"
        },
        handleDesblock:{
          long:"desbloquear esta vaga",
          short:"Desbloquear"
        }
      }

      const accepted = await confirm({
          title: "Alterar status",
          message: `Tem certeza que deseja ${texts[fn.name as TranslateFnName].long}?`,
          confirmText: `${texts[fn.name as TranslateFnName].short}`,
          cancelText: "Cancelar",
      });

      if (!accepted) return;

      setLoading(true);
      
      try{
          
          const response = await fn(id);

          toast.success(response.data.message);
          
          if(load){
              await load();
          }

      }catch(error){
          handleServerError(error);
      }finally{
          setLoading(false);
      }
  }

  return (
    <Flex direction="column" gap="4">
      {ConfirmationDialog}
      {ShowFeedbackDialog}

      <Text fontSize="2xl" fontWeight="semibold">Moderação de vagas</Text>
      
      <DataTable
        columns={[
          {
            key: "job",
            label: "Denúncias",
            render: (report) => (
              <Flex alignItems="flex-start" direction="column" gap="3.5">

                {(report.status == "pending" || report.status == "under_review") &&
                  <Flex gap="2">
                    <Button 
                      title="Este botão resolve a denúncia bloqueia a vaga."
                    onClick={ async ()=>  await handle(resolved, report.id)} size="xs" bg="green.500">Resolvida</Button>
                    <Button
                      title="Este botão rejeita a denúncia e não bloqueia a vaga."
                    onClick={ async ()=>  await handle(rejected, report.id)} size="xs" bg="red.500" color="gray.300">Rejeitada</Button>
                  </Flex>
                }
                {(report.status == "rejected" || report.status == "resolved") &&
                  <Flex gap="2">
                    <Button onClick={ async ()=>  await handle(underReview, report.id)} size="xs" bg="blue.500">Revisar decisão</Button>
                  </Flex>
                }

                <Text fontSize="2xl" fontWeight="bold">
                  {report.job.company.name}
                </Text>
                <Link href={`/company/vagas/${report.job.id}`}>
                  <Flex direction="column" gap="3">
                    <Text fontSize="md">
                      Vaga: {report.job.title}
                    </Text>
                  </Flex>
                </Link>

                <Flex direction="column" gap="1">
                    {report.reason && 
                      <Flex direction="row">
                        Motivo da denúncia: <ReportReasonComponent status={report.reason} />
                      </Flex>
                    }
                    
                    <ReportStatusComponent status={report.status} />
                </Flex>

                <Flex gap="1" direction="column">
                  <Text>Histórico</Text>
                  <Text color="gray.500" fontSize="xs">Criado em: {dateFormat(report.createdAt)}</Text>
                  {report.updatedAt && 
                    <Text color="gray.500" fontSize="xs">Atualizado em: {dateFormat(report.updatedAt)}</Text>
                  }
                  {report.reviewedAt && 
                    <Text color="gray.500" fontSize="xs">Revisado em: {dateFormat(report.reviewedAt)}</Text>
                  }
                  <Button 
                    size="xs"
                    variant="ghost"
                  onClick={ () => handleOpen(report.description, { title: "Descrição da denúncia"}) }>Ver descrição</Button>
                  {report.job.isBlocked && 
                    <Button 
                    size="xs"
                    onClick={async ()=>  await handle(handleDesblock, report.job.id)} >Desbloquear vaga</Button>
                  }
                </Flex>
              </Flex>
            ),
          },
        ]}
        data={reports}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Flex>
  );
}
