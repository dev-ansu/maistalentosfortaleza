import { DEGREE_LEVEL } from "@/_constants";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { ExperienceListProps } from "@/_types/CandidateProfile";
import { Button, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import z from "zod";

const deleteExperienceSchema = z.object({
    id: z.uuid("Id inválido.")
});

interface ExperienceListPropsComponent {
  experienceList: ExperienceListProps[];
  setExperienceList: React.Dispatch<React.SetStateAction<ExperienceListProps[]>>;
}

export const ExperienceList = ({ experienceList, setExperienceList }: ExperienceListPropsComponent)=>{

  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, serverErrors } = useServerErrors();

  const onDelete = async(id: string)=>{
        setIsLoading(true);
     try {
        const data = deleteExperienceSchema.parse({ id });
        try{
            const response = await getAPIClient().delete(`/candidate/experience/${data.id}`);
            setExperienceList((prev) => prev.filter(item => item.id !== data.id));
            toast.success(response.data.message)
        }catch(err){
            handleServerError(err);
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
    <Table.ScrollArea mt="4" borderWidth="1px" maxW="100vw">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Empresa</Table.ColumnHeader>
            <Table.ColumnHeader>Cargo</Table.ColumnHeader>
            <Table.ColumnHeader>Descrição</Table.ColumnHeader>
            <Table.ColumnHeader>Data de início</Table.ColumnHeader>
            <Table.ColumnHeader>Data de término</Table.ColumnHeader>
            <Table.ColumnHeader>Atualmente</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {experienceList && experienceList.map((item) => {
            return(
            <Table.Row key={item.id}>
              <Table.Cell>
                <Stack direction="row" alignItems="center" justifyItems="flex-start">
                    <Button disabled={isLoading} onClick={() => onDelete(item.id)} size="xs" bg="red.500">
                        <IoClose  />
                    </Button>
                    {item.company}
                </Stack>
              </Table.Cell>
              <Table.Cell>{item.position}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>
                {item.startDate ? (new Date(item.startDate)).toLocaleDateString('pt-BR', {
                    timeZone: "UTC"
                }):""}</Table.Cell>
              <Table.Cell>
              {item.endDate ? (new Date(item.endDate)).toLocaleDateString('pt-BR', {
                timeZone: "UTC"
              }):""}  
              </Table.Cell>
              <Table.Cell bg={`${item.currentlyWorking ? "green":"blue"}`} textAlign="center">{item.currentlyWorking ? "Sim":"Não"}</Table.Cell>
            </Table.Row>
            )})}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}