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
import { CreateRoleModal } from "./CreateRoleModal";
import { IoClose } from "react-icons/io5";
// import { ChangeVerificationStatus } from "./Filters";

export interface RolePermission{

}

export interface Role{
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  createdAt: Date;
}

const roleId = z.object({
    id: z.uuid("Id inválido.")
});



export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, serverErrors } = useServerErrors();


  const { filters, updateFilter, resetFilters } = useTableFilters({
    initialFilters: {
      search: '',
      page: 1
    }
  });
  
  async function load() {
    
    setLoading(true);

    const queryString = buildQueryParams(filters);
    
    const res = await getAPIClient().get(
      `/admin/list/roles?${queryString}`
    );

    const items = res.data.data.data;


    setRoles(items);
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
  
  
  const onDelete = async(id: string)=>{
      if(!window.confirm("Deseja realmente apagar esta função/papel?")) return;
      setIsLoading(true);
       try {
          const data = roleId.parse({ id });
          try{
              const response = await getAPIClient().delete(`/admin/roles/${data.id}`);
              setRoles((prev) => prev.filter(item => item.id !== data.id));
              toast.success(response.data.message)
          }catch(err){
              handleServerError(err);
              console.log(serverErrors)
          }finally{
              setIsLoading(false);
          }
      } catch (error) {
          if (error instanceof z.ZodError) {
          const message = JSON.parse(error.message);
          toast.error(message[0].message);
      }
    }finally{
      setIsLoading(false);
    }
  }
 

  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Funções/papéis</Text>

      <CreateRoleModal load={load} />

      <DataTable
        resetFilters={resetFilters}

        columns={[
          { key: "name", label: "Nome" },
          { key: "description", label: "Descrição" },
          {
            key: "createdAt",
            label: "Criado em",
            render: (c) => new Date(c.createdAt).toLocaleDateString("pt-BR"),
          },
        ]}
        data={roles}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Pesquise por uma função/papel por nome"
        renderActions={(role) => (
          <Flex gap="0.5" alignItems="center">

            <Button disabled={isLoading} onClick={() => onDelete(role.id)} title="Excluir função/papel" size="xs" bg="red.500">
              <IoClose />
            </Button>
          
          </Flex>
        )}
      />
    </Flex>
  );
}
