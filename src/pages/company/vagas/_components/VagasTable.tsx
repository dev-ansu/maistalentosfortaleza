import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { dateFormat } from "@/_utils/dateFormat";
import { Button,  Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye, FiSend, FiStopCircle } from "react-icons/fi";
import { VagaFormData } from "@/_validations/vagas";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { useEnumsContext } from "@/_context/EnumsContext";
import { MdClose, MdOpenWith } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

export interface VagasProps extends VagaFormData{
  id: string;
  companyId: string;
  status: string; 
  state: StateProps;
  city: CityProps;
  company: CompanyProfile;
  isDraft: boolean;
  createdAt: string;
}


export default function VagasTable() {
  const [vagas, setVagas] = useState<VagasProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { enums } = useEnumsContext();
  const [totalPages, setTotalPages] = useState(1);
  const { filters, updateFilter, resetFilters } = useTableFilters({
      initialFilters: {
        search: "",
        page: 1
      }
    });

  
    async function load() {
      setLoading(true);
  
      const queryString = buildQueryParams(filters);
      
      const res = await getAPIClient().get(
        `/vagas?${queryString}`
      );
  
      const items = res.data.data.data;
  
  
      setVagas(items);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(res.data.data.currentPage);
      setLoading(false);
    }
  
    useEffect(() => {
      load();
    }, [filters.page, filters.search]); // Carrega quando filtros específicos mudam
  
  
    const handleSearch = (searchTerm: string) => {
      updateFilter('search', searchTerm);
      updateFilter('page', 1);
    };
  
    const handlePageChange = (page: number) => {
      updateFilter('page', page);
    };

  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Minhas vagas</Text>

      <DataTable
        resetFilters={resetFilters}
        columns={[
          { key: "title", label: "Título da vaga"},
          { key: "workloadType", label: "Tipo de carga horária"},
          { key: "expiresAt", label: "Expira em", render: (c) => dateFormat(c.expiresAt)},
          { key: "status", label: "Status", render: (c) => enums?.JobStatus.filter( item => item.value == c.status)[0].label ?? c.status},
          { key: "isDraft", label: "Publicada", render: (c) => c.isDraft ? 'Não':'Sim' },
          {
            key: "createdAt",
            label: "Criado em",
            render: (c) => dateFormat(c.createdAt),
          },
        ]}
        data={vagas}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        renderActions={(vaga) => (
          <Flex gap="1">
            <Link href={`/vagas/${vaga.id}`}>
              <Button
                title="Ver vaga"
                size="sm"
                bg="blue.500"
              >
                
                <FiEye  />  
              </Button>
            </Link>

            <Button size="sm" bg="green.500" title="Publicar vaga"><FiSend /></Button>

            <Button size="sm" title="Abrir vaga"><MdOpenWith /></Button>
            <Button size="sm" bg="orange.500" title="Pausar vaga"><FiStopCircle /></Button>
            <Button size="sm" bg="red.500" title="Fechar vaga"><MdClose /></Button>

            <Link href={`/vagas/edit/${vaga.id}`}>
              <Button
                title="Editar vaga"
                size="sm"
                bg="yellow.500"
              >
                
                <FaPencil  />  
              </Button>
            </Link>

          </Flex>
        )}
      />
    </Flex>
  );
}
