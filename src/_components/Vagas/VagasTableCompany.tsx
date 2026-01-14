import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { dateFormat } from "@/_utils/dateFormat";
import { Box, Button,  Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye, FiSend } from "react-icons/fi";
import { VagaFormData } from "@/_validations/vagas";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { useEnumsContext } from "@/_context/EnumsContext";
import { FaPencil } from "react-icons/fa6";
import { usePublishVaga } from "@/_hooks/usePublishVaga";
import { JobStatusChangeForm } from "./StatusFromChange";
import { JobStatus } from "@/_types/Job";

export interface VagasProps extends Omit<VagaFormData, "workloadType" | 'type'>{
  id: string;
  companyId: string;
  status: string; 
  type: string;
  state: StateProps;
  city: CityProps;
  workloadType: string;
  company: CompanyProfile;
  isDraft: boolean;
  createdAt: string;
  totalApplications: number;
  _count: {
      applications: number;
  }
}




export function VagasTableCompany() {
  const { isLoading, ConfirmationDialog, handlePublish } = usePublishVaga();
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

  const handlePublishVaga = async (id: string)=>{
    const res = await handlePublish(id);
    if(res) await load();
  }
  
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
      {ConfirmationDialog}
      <Text fontSize="2xl" fontWeight="semibold">Minhas vagas</Text>

      <DataTable
        resetFilters={resetFilters}
        columns={[
          { key: "title", label: "Título da vaga"},
          { key: "workloadType", label: "Tipo de carga horária", render: (c) => 
            enums ? enums?.WorkloadType.filter( item => item.value == c.workloadType)[0].label: c.workloadType},
          {key: "totalApplications", label: "Candidaturas", render: ( c ) => {
            return(
              <>
                {c._count.applications > 0 ? 
                <Link href={`/company/candidaturas/${c.id}`} title="Candidaturas desta vaga">
                  <Box alignSelf="center" justifySelf="center" borderBottomWidth="1px" color="blue.500" 
                  _hover={{ borderBottomWidth:"1px", borderBottomColor:"blue.500", transition:"all"}} 
                  borderBottomColor="transparent" textAlign="center">
                  {c._count.applications}
                  </Box>
                </Link>
                :<Box alignSelf="center" justifySelf="center" borderBottomWidth="1px" color="blue.500" 
                  _hover={{ borderBottomWidth:"1px", borderBottomColor:"blue.500", transition:"all"}} 
                  borderBottomColor="transparent" textAlign="center">
                  {c._count.applications}
                  </Box>
                }
              </>
            )
          } },
          { key: "expiresAt", label: "Expira em", render: (c) => {
            return(
              <Box alignSelf="center" justifySelf="center" rounded="sm" px="2" py="0.5" w="max-content" textAlign="center" bg={
                new Date(c.expiresAt).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) ? "red.500":"green.500"}>
                {dateFormat(c.expiresAt)}
              </Box>
            )
          }},
          { key: "status", label: "Status", render: (c) => {
            return(
              <JobStatusChangeForm id={c.id} actualStatus={c.status as JobStatus} />
            )
          }},
          { key: "isDraft", label: "Publicada", render: (c) => {
            return (
              <Box alignSelf="center" justifySelf="center" rounded="sm" px="2" py="0.5" w="max-content" textAlign="center" bg={c.isDraft ? "red.500":"green.500"}>
                {c.isDraft ? 'Não':'Sim'}
              </Box>
            )
          } },
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
              
              <Link href={`/company/vagas/${vaga.id}`}>
                <Button
                  title="Ver vaga"
                  size="xs"
                  bg="blue.500"
                >
                  
                  <FiEye  />  
                </Button>
              </Link>

              <Button loading={isLoading} onClick={async() => await handlePublishVaga(vaga.id) } size="xs" bg="green.500" title="Publicar vaga"><FiSend /></Button>
              <Link href={`/vagas/edit/${vaga.id}`}>
                <Button
                  title="Editar vaga"
                  size="xs"
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
