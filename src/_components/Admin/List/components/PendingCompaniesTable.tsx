import { DataTable } from "@/_components/DataTable";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod";
import { ChangeVerificationStatus } from "./_filters/Filters";
import { Can } from "@/_components/ui/Can/Can";
import { useHasPermission } from "@/_hooks/useHasPermission";

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

const companyId = z.object({
    id: z.uuid("Id inválido.")
});

export const bgStatus = {
  pending: "orange.500",
  approved: "green.500",
  rejected:"red.500",
  under_review: "blue.500"
}

export type StatusKey = keyof typeof bgStatus;


export function PendingCompaniesTable() {
  const { hasPermission } = useHasPermission();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { enums } = useEnumsContext();
  const { handleServerError } = useServerErrors(); 

  const { filters, updateFilter, resetFilters } = useTableFilters({
    initialFilters: {
      verificationStatus: "pending",
      search: "",
      page: 1
    }
  });
  let handleChangeVerificationStatus: (id: string)=> Promise<void>;
  
  async function load() {
    
    setLoading(true);

    const queryString = buildQueryParams(filters);
    
    const res = await getAPIClient().get(
      `/admin/list/companies?${queryString}`
    );

    const items = res.data.data.data;


    setCompanies(items);
    setTotal(res.data.data.total);
    setTotalPages(res.data.data.totalPages);
    setCurrentPage(res.data.data.currentPage);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters.page, filters.verificationStatus, filters.search]); // Carrega quando filtros específicos mudam

  const handleStatusChange = (value: string) => {
    updateFilter('verificationStatus', value);
    updateFilter('page', 1); // Volta para página 1
  };

  const handleSearch = (searchTerm: string) => {
    updateFilter('search', searchTerm);
    updateFilter('page', 1);
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  

  if(hasPermission(["company.approve", "company.verify"])){

      handleChangeVerificationStatus = async( id: string )=>{
          
          if(!window.confirm("Deseja alterar o status da empresa?")) return;

          try {
              const data = companyId.parse({ id });
          
              try{
                  const response = await getAPIClient().patch(`/admin/company/${data.id}/verify`)
                  toast.success(response.data.message)
                  load();
              }catch(err){
                  handleServerError(err);
              }
          } catch (error) {
              if (error instanceof z.ZodError) {
                  const message = JSON.parse(error.message);
                  toast.error(message[0].message);
              }
          }

      }
  }
  
 
  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Empresas</Text>

      <DataTable
        resetFilters={resetFilters}
        filters={
          <Flex w="full" gap="2" direction="column">
            <Text>Filtros</Text>
            <Flex w="full">
              <ChangeVerificationStatus defaultStatus={filters.verificationStatus} handleStatusChange={handleStatusChange} />
            </Flex>
          </Flex>
        }
        columns={[
          { key: "name", label: "Nome" },
          { key: "cnpj", label: "CNPJ" },
          { key: "contactEmail", label: "Contato" },
          { key: "phone", label: "Telefone" },
          { key: "verificationStatus", label: "Status", render: (c) =>{
            let verificationStatus = [{label: c.verificationStatus}];
            if(enums){
              verificationStatus = enums.VerificationStatus.filter( item => item.value == c.verificationStatus)
            }
            return (
              <Stack bg={`${bgStatus[c.verificationStatus as StatusKey]}`} textAlign="center" rounded="sm">
                {verificationStatus[0].label}
              </Stack>
            );
          } },
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
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Pesquise por uma empresa por nome, e-mail ou CNPJ"
        renderActions={(company) => (
          <Flex gap="0.5" alignItems="center">
              <Can permission={['company.approve', 'company.verify']}>
                <Button
                    title={`Status atual: ${company.verificationStatus}`}
                    size="xs"
                    bg={`${bgStatus[company.verificationStatus as StatusKey]}`}
                    onClick={() => handleChangeVerificationStatus(company.id)}
                >
                  <MdChangeCircle  />
                </Button>
              </Can>
              <Link title="Ver dados da empresa" href={`/company/${company.id}`}>
                <Button size="xs" bg="blue.500">
                  <FiEye />
                </Button>
              </Link>
          </Flex>
        )}
      />
    </Flex>
  );
}
