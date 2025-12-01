import { DataTable } from "@/_components/DataTable";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateInterestList, CandidateProfile } from "@/_types/CandidateProfile";
import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheck, FiEye } from "react-icons/fi";

export interface CandidateProps extends CandidateProfile{
  id: string;
  phone: string;
  whatsapp: string;
  birthdate: Date | string;
  email: string;
  isActive: boolean;
  createdAt: string;
  candidateInterests: CandidateInterestList[];
}


export default function UsersTable() {
  const [companies, setCompanies] = useState<CandidateProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function load(page: number, search?: string) {
    setLoading(true);

    const res = await getAPIClient().get(`/admin/users?page=${page}&search=${search ?? ""}`);

    const items = res.data.data.users; // Ajuste para "items"

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
        columns={[
          { key: "user", label: "Nome",  render: (c) => c.user?.name || 'N/A'  },
          { key: "email", label: "E-mail", render: (c) => c.user?.email || 'N/A' },
          { key: "phone", label: "Contato" },
          { key: "whatsapp", label: "WhatsApp" },
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
        renderActions={(user) => (
          <Flex>
            <Link href={`/candidate/curriculo/${user.id}`}>
              <Button
              title="Ver curriculo"
              size="sm"
              bg="blue.500"
            >
              
              <FiEye  />  
            </Button>
              </Link>
          </Flex>
        )}
      />
    </Flex>
  );
}
