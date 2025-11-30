import { DataTable } from "@/_components/DataTable";
import { getAPIClient } from "@/_services/apiClient";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  contactEmail: string;
  isActive: boolean;
  verificationStatus: string;
  createdAt: string;
}


export default function PendingCompaniesTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function load(page: number, search?: string) {
    setLoading(true);

    const res = await getAPIClient().get(`/admin/companies/pending?page=${page}&search=${search ?? ""}`);

    const items = res.data.data.companies; // Ajuste para "items"

    setCompanies(items);
    setTotal(res.data.data.total);
    setTotalPages(res.data.data.totalPages);
    setCurrentPage(res.data.data.currentPage);

    setLoading(false);
  }

  useEffect(() => {
    load(1);
  }, []);

  

  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Empresas esperando aprovação para publicar vagas</Text>

      <DataTable
        filters={
          <Flex>
            <Text>Testando filtros</Text>
          </Flex>
        }
        columns={[
          { key: "name", label: "Nome" },
          { key: "cnpj", label: "CNPJ" },
          { key: "contactEmail", label: "Contato" },
          { key: "verificationStatus", label: "Status" },
          {
            key: "createdAt",
            label: "Criado em",
            render: (c) => new Date(c.createdAt).toLocaleDateString("pt-BR"),
          },
        ]}
        data={companies}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => load(p)}
        onSearch={(q) => load(1, q)}
        renderActions={(company) => (
          <Flex>
              {company.verificationStatus == "pending" &&
              <Button
              title="Aprovar empresa"
              size="sm"
              bg="green.500"
              onClick={() => alert(company.id)}
            >
              <FiCheck  />
            </Button>}
          </Flex>
        )}
      />
    </Flex>
  );
}
