import { DataTable } from "@/_components/DataTable";
import { EnumProps, useEnumsContext } from "@/_context/EnumsContext";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { Button, createListCollection, Flex, Portal, Select, Text } from "@chakra-ui/react";
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
  const { enums } = useEnumsContext();
  
  const { filters, updateFilter, resetFilters } = useTableFilters({
    initialFilters: {
      verificationStatus: "pending",
      search: "",
      page: 1
    }
  });
  
  async function load() {
    setLoading(true);

    const queryString = buildQueryParams(filters);
    
    const res = await getAPIClient().get(
      `/admin/companies/pending?${queryString}`
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

  const verificationStatusList = createListCollection({
      items: enums ? enums.VerificationStatus: [ { label: '', value: ''}]
  });

 
  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Empresas esperando aprovação para publicar vagas</Text>

      <DataTable
        resetFilters={resetFilters}
        filters={
          <Flex w="full" gap="2" direction="column">
            <Text>Filtros</Text>
            <Flex w="full">
              <Select.Root 
                  defaultValue={["pending"]}
                  onValueChange={({value}) => handleStatusChange(value[0])}
                  collection={verificationStatusList}  
                  width="full"
              >
              <Select.HiddenSelect />
              <Select.Control>
                  <Select.Trigger>
                  <Select.ValueText placeholder="Selecione uma escolaridade" />
                      </Select.Trigger>
                  <Select.IndicatorGroup>
                      <Select.Indicator />
                  </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                  <Select.Positioner>
                  <Select.Content>
                      {verificationStatusList.items && verificationStatusList.items.map((status) => (
                      <Select.Item item={status} key={status.value}>
                          {status.label}
                          <Select.ItemIndicator />
                      </Select.Item>
                      ))}
                  </Select.Content>
                  </Select.Positioner>
              </Portal>
          </Select.Root>
            </Flex>
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
        onPageChange={handlePageChange}
        onSearch={handleSearch}
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
