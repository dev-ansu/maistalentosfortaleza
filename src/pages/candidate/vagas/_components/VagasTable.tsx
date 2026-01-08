import { DataTable } from "@/_components/DataTable";
import { buildQueryParams, useTableFilters } from "@/_hooks/useTableFilters";
import { getAPIClient } from "@/_services/apiClient";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { dateFormat } from "@/_utils/dateFormat";
import { Button,  Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VagaFormData } from "@/_validations/vagas";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { useEnumsContext } from "@/_context/EnumsContext";
import { z } from "zod";
import { FaBuilding, FaCheckCircle } from "react-icons/fa";
import { StateItems } from "@/_components/StateSelect";
import { CitiesItems } from "@/_components/CitySelect";
import { useFormContext } from "react-hook-form";
import { SearchFormData } from "..";

export interface VagasProps extends Omit<VagaFormData, "workloadType" | "type">{
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




export function VagasTable({states}: { states: StateProps[]}) {
  const { resetField, handleSubmit, formState:{ isSubmitting} } = useFormContext<SearchFormData>();
  const [vagas, setVagas] = useState<VagasProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { enums } = useEnumsContext();
  const [totalPages, setTotalPages] = useState(1);

  const { filters, updateFilter, resetFilters } = useTableFilters({
      initialFilters: {
        stateId: [],
        cityId: [],
        search: "",
        page: 1
      }
    });

    
  async function load() {
    setLoading(true);

    const queryString = buildQueryParams(filters);
    
    const res = await getAPIClient().get(
      `/candidate/vagas?${queryString}`
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
  }, [filters.page, filters.stateId, filters.cityId, filters.search]); // Carrega quando filtros específicos mudam


  const handleSearch = (searchTerm: string) => {
    updateFilter('search', searchTerm);
    updateFilter('page', 1);
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
  };

  const onSubmit = (data: SearchFormData)=>{
      updateFilter("stateId", data.stateId);
      updateFilter("cityId", data.cityId)
      updateFilter("page", 1);
  }
  const hasActiveFilters = () => {
    return (
      filters.search.trim() !== "" ||
      filters.stateId.length > 0 ||
      filters.cityId.length > 0 ||
      filters.page !== 1
    );
  };

  const resetAllFilters = ()=>{
    if(!hasActiveFilters()) return;
      resetField("cityId", {defaultValue: []})
      resetField("stateId", {defaultValue: []})
      resetFilters()
  }

  return (
    <Flex className="p-6" direction="column" gap="4">

      <Text fontSize="2xl" fontWeight="semibold">Vagas abertas</Text>

      <DataTable
        resetFilters={resetAllFilters}
        filters={
          <Flex gap="2" direction="column">
              <Text>Onde?</Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Flex gap="2">

                    <StateItems states={states} />
                    <CitiesItems />
                  </Flex>
                  <Button disabled={isSubmitting} mt="4" type="submit">Filtrar</Button>
                </form>
          </Flex>
        }
        columns={[
          { key: "title", label: "Vagas", render: (c)=>{
            const type = enums ? enums.WorkModel.filter( item => item.value === c.type)[0].label:c.type;
            return(
              <Flex direction="column" gap="2">
                <Text fontSize="2xl" fontWeight="bold">{c.title}</Text>
                <Text color="gray.300" display="flex" gap="1" alignItems="center">
                  <FaCheckCircle /> {c.company.name}
                </Text>
                <Text color="gray.400">{c.city.name}, {c.state.acronym}</Text>
                <Text color="gray.400" display="flex" gap="1" alignItems="center">
                  <FaBuilding /> {type}
                </Text>
                <Text fontSize="sm" color="gray.400">Publicada em: {dateFormat(c.createdAt)}</Text>
              </Flex>
            )
          }},
        ]}
        data={vagas}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </Flex>
  );
}
