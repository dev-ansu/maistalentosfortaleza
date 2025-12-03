import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateInterestList, CandidateProfile } from "@/_types/CandidateProfile";
import { InterestAreas } from "@/_types/InterestArea";
import { Button, createListCollection, Flex, Portal, Select, Text } from "@chakra-ui/react";
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


export default function UsersTable({ interestAreas }: { interestAreas: InterestAreas[] }) {
  const [users, setUsers] = useState<CandidateProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { filters, updateFilter, resetFilters } = useTableFilters({
      initialFilters: {
        interestId: "",
        search: "",
        page: 1
      }
    });

    const interestAreasList = createListCollection({
        items: interestAreas && interestAreas.length > 0 ? interestAreas.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });
    
    async function load() {
      setLoading(true);
  
      const queryString = buildQueryParams(filters);
      
      const res = await getAPIClient().get(
        `/admin/users?${queryString}`
      );
  
      const items = res.data.data.data;
  
  
      setUsers(items);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(res.data.data.currentPage);
      setLoading(false);
    }
  
    useEffect(() => {
      load();
    }, [filters.page, filters.search, filters.interestId]); // Carrega quando filtros específicos mudam
  
  
    const handleSearch = (searchTerm: string) => {
      updateFilter('search', searchTerm);
      updateFilter('page', 1);
    };

    const handleChangeInterest = (interestId: string) => {
      updateFilter('interestId', interestId);
      updateFilter('page', 1);
    };
  
    const handlePageChange = (page: number) => {
      updateFilter('page', page);
    };

  return (
    <Flex className="p-6" direction="column" gap="4">
      <Text fontSize="2xl" fontWeight="semibold">Candidatos</Text>

      <DataTable
        resetFilters={resetFilters}
        filters={
          <Flex>
              <Select.Root 
                  collection={interestAreasList}  
                  onValueChange={( { value }) => handleChangeInterest(value[0])}
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
                      {interestAreasList.items && interestAreasList.items.map((interestArea) => (
                      <Select.Item item={interestArea} key={interestArea.value}>
                          {interestArea.label}
                          <Select.ItemIndicator />
                      </Select.Item>
                      ))}
                  </Select.Content>
                  </Select.Positioner>
              </Portal>
          </Select.Root>

          </Flex>
        }
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
        data={users}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
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
