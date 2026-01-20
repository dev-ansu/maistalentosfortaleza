import { DataTable } from "@/_components/DataTable";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { RejectApplyDrawer } from "@/_components/Vagas/Apply/ApplicationActionDrawer";
import { useEnumsContext } from "@/_context/EnumsContext";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { dateFormat } from "@/_utils/dateFormat";
import {
  Button,
  Checkbox,
  Flex,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { FiLoader, FiX } from "react-icons/fi";
import z from "zod";

export const maxLettersRejectionReason = 2048;

const rejectionValidation = z.object({
  applicationIds: z.array(z.string()),
  rejectionReason: z
    .string()
    .trim()
    .nonempty({ message: "Campo obrigatório" })
    .max(maxLettersRejectionReason),
});

type RejectionReasonFormData = z.infer<typeof rejectionValidation>;

export default function CompanyJobApplications({ jobId }: { jobId: string }) {
  const { enums } = useEnumsContext();
  const ApplicationStatus = enums?.ApplicationStatus;

  const [jobTitle, setJobTitle] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const methods = useForm<RejectionReasonFormData>({
    resolver: zodResolver(rejectionValidation),
    defaultValues: { applicationIds: [] },
  });

  const { filters, updateFilter } = useTableFilters({
    initialFilters: { page: 1 },
  });

  async function load() {
    setLoading(true);

    const queryString = buildQueryParams({
      ...filters,
      pageSize: 10,
    });

    const res = await getAPIClient().get(
      `/vaga/${jobId}/applications?${queryString}`
    );

    setApplications(res.data.data.data);
    setJobTitle(res.data.data.jobTitle);
    setTotal(res.data.data.total);
    setCurrentPage(res.data.data.currentPage);
    setTotalPages(res.data.data.totalPages);

    setSelectedIds([]); // limpa seleção ao trocar página
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters.page]);

  const validApplications = applications.filter(
    (app) => app.status !== "rejected"
  );

  const allSelected =
    validApplications.length > 0 &&
    validApplications.every((app) => selectedIds.includes(app.id));

  return (
    <>
      <Head>
        <title>Mais Talentos Fortaleza - Candidaturas</title>
      </Head>

      <Sidebar>
        <FormProvider {...methods}>
          <RejectApplyDrawer open={open} setOpen={setOpen} />
        </FormProvider>

        <Flex direction="column" gap="4">
          <Text
            w="full"
            mb="16px"
            borderBottomWidth="1px"
            borderBottomColor="gray.700"
          >
            Candidaturas
          </Text>

          <Text fontSize="3xl">Vaga: {jobTitle}</Text>

          {selectedIds.length > 0 && (
            <Button
              size="xs"
              colorScheme="red"
              alignSelf="flex-start"
              onClick={() => {
                methods.setValue("applicationIds", selectedIds);
                setOpen(true);
              }}
            >
              <FiX /> Rejeitar selecionados ({selectedIds.length})
            </Button>
          )}

          <DataTable
            data={applications}
            loading={loading}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateFilter("page", page)}
            columns={[
              {
                key: "select",
                label: (
                  <Checkbox
                    isChecked={allSelected}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? validApplications.map((a) => a.id)
                          : []
                      )
                    }
                  />
                ),
                render: (application) =>
                  application.status !== "rejected" ? (
                    <Checkbox
                      isChecked={selectedIds.includes(application.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, application.id]
                            : prev.filter((id) => id !== application.id)
                        )
                      }
                    />
                  ) : null,
              },
              {
                key: "candidate",
                label: "Candidato",
                render: (application) => (
                  <Flex direction="column" gap="1.5">
                    <Link
                      href={`/candidate/curriculo/${application.candidate.id}`}
                    >
                      <Text fontSize="2xl" fontWeight="bold">
                        {application.candidate.user.name}
                      </Text>
                    </Link>

                    <Text
                      color="gray.300"
                      display="flex"
                      gap="1"
                      alignItems="center"
                    >
                      {application.status === "rejected" && <FiX />}
                      {application.status === "accepted" && (
                        <FaCheckCircle />
                      )}
                      {application.status === "pending" && <FiLoader />}
                      {
                        ApplicationStatus?.find(
                          (item) => item.value === application.status
                        )?.label ?? application.status
                      }
                    </Text>

                    <Text fontSize="sm" color="gray.400">
                      Candidatou-se em:{" "}
                      {dateFormat(application.appliedAt)}
                    </Text>
                  </Flex>
                ),
              },
              {
                key: "actions",
                label: "Ações",
                render: (application) =>
                  application.status !== "rejected" && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        methods.setValue("applicationIds", [
                          application.id,
                        ]);
                        setOpen(true);
                      }}
                    >
                      <FiX /> Rejeitar
                    </Button>
                  ),
              },
            ]}
          />
        </Flex>
      </Sidebar>
    </>
  );
}
