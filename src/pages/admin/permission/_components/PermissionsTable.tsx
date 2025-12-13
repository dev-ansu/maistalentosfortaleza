import { DataTable } from "@/_components/DataTable";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { CreatePermissionModal } from "./CreatePermissionModal";
import { IoClose } from "react-icons/io5";
// import { ChangeVerificationStatus } from "./Filters";

export interface RolePermission{

}

export interface Permission{
  id: string;
  name: string;
  module: string;
  description: string;
}

const permissionId = z.object({
    id: z.uuid("Id inválido.")
});



export default function PermissionsTable() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
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
      `/admin/list/permission?${queryString}`
    );

    const items = res.data.data.data;


    setPermissions(items);
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
      if(!window.confirm("Deseja realmente apagar esta permissão?")) return;
      setIsLoading(true);
       try {
          const data = permissionId.parse({ id });
          try{
              const response = await getAPIClient().delete(`/admin/permission/${data.id}`);
              setPermissions((prev) => prev.filter(item => item.id !== data.id));
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
      <Text fontSize="2xl" fontWeight="semibold">Permissões</Text>

      <CreatePermissionModal load={load} />

      <DataTable
        resetFilters={resetFilters}

        columns={[
          { key: "module", label: "Módulo" },
          { key: "name", label: "Nome", render: (permission)=>{
            return `${permission.module}.${permission.name}`
          } },
          { key: "description", label: "Descrição" },
        ]}
        data={permissions}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Pesquise por uma permissão pelo nome"
        renderActions={(permission) => (
          <Flex gap="0.5" alignItems="center">

            <Button disabled={isLoading} onClick={() => onDelete(permission.id)} title="Excluir permissão" size="xs" bg="red.500">
              <IoClose />
            </Button>
          
          </Flex>
        )}
      />
    </Flex>
  );
}
