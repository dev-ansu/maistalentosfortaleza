import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useShowFeedback } from "@/_hooks/useShowFeedback";
import { getAPIClient } from "@/_services/apiClient";
import { dateFormat } from "@/_utils/dateFormat";
import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiLoader, FiX } from "react-icons/fi";
import { RemoveApplication } from "@/_components/Vagas/Apply/RemoveApplication";
import { ApplicationStatus } from "@/_types/Job";
import { ApplicationStatusComponent } from "../ui/ApplicationStatus/ApplicationStatus";

interface CandidateApplications {
  id: string;
  appliedAt: string;
  rejectionReason: string;
  status: ApplicationStatus;
  updatedAt: Date;
  createdAt: Date;
  job: {
    company: { name: string };
    id: string;
    title: string;
  };
}

export function CandidaturasTable() {
  const { ShowFeedbackDialog, handleOpen } = useShowFeedback();
  const [applications, setApplications] = useState<CandidateApplications[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      `/candidate/applications?${queryString}`
    );

    setApplications(res.data.data.data);
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

      <DataTable
        columns={[
          {
            key: "job",
            label: "Candidaturas",
            render: (application) => (
              <Flex direction="column" gap="2">
                <Link href={`/company/vagas/${application.job.id}`}>
                  <Flex direction="column" gap="3">
                    <Text fontSize="2xl" fontWeight="bold">
                      {application.job.title}
                    </Text>

                    <ApplicationStatusComponent status={application.status} />

                    <Text fontSize="sm" color="gray.400">
                      Candidatou-se em:{" "}
                      {dateFormat(application.appliedAt)}
                    </Text>
                    {application.updatedAt &&
                      <Text fontSize="sm" color="gray.400">Última atualização: {dateFormat(application.updatedAt)}</Text>
                    }
                  </Flex>
                </Link>

                <Flex justifyContent="space-between" alignItems="center">
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

                  {application.status !== "rejected" && (
                    <RemoveApplication
                      jobId={application.job.id}
                      load={load}
                    />
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
    </Flex>
  );
}
