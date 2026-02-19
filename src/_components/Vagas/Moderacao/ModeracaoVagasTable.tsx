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
  };
}



export function ModeracaoVagasTable() {
  const [reports, setReports] = useState<Reports[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleOpen, ShowFeedbackDialog } = useShowFeedback();

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

  return (
    <Flex direction="column" gap="4">
      
      {ShowFeedbackDialog}

      <Text fontSize="2xl" fontWeight="semibold">Moderação de vagas</Text>
      
      <DataTable
        columns={[
          {
            key: "job",
            label: "Denúncias",
            render: (report) => (
              <Flex alignItems="flex-start" direction="column" gap="3.5">
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
