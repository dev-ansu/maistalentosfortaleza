import { DEGREE_LEVEL } from "@/_constants";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { EducationListProps } from "@/_types/CandidateProfile";
import { Button, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import z from "zod";

const deleteEducationSchema = z.object({
    id: z.uuid("Id inválido.")
});

interface EducationListPropsComponent {
  educationList: EducationListProps[];
  setEducationList: React.Dispatch<React.SetStateAction<EducationListProps[]>>;
}

export const EducationList = ({ educationList, setEducationList }: EducationListPropsComponent)=>{

  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, serverErrors } = useServerErrors();

  const onDelete = async(id: string)=>{
        setIsLoading(true);
     try {
        const data = deleteEducationSchema.parse({ id });
        try{
            const response = await getAPIClient().delete(`/candidate/education/${data.id}`);
            setEducationList((prev) => prev.filter(item => item.id !== data.id));
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
    <Table.ScrollArea mt="4" borderWidth="1px" maxW="100vw">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nível</Table.ColumnHeader>
            <Table.ColumnHeader>Curso</Table.ColumnHeader>
            <Table.ColumnHeader>Instituição</Table.ColumnHeader>
            <Table.ColumnHeader>Data de início</Table.ColumnHeader>
            <Table.ColumnHeader>Data de término</Table.ColumnHeader>
            <Table.ColumnHeader>Cursando</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {educationList && educationList.map((item) => {
            const degreeLevel = DEGREE_LEVEL.filter( i => i.id == item.degree)[0];
            return(
            <Table.Row key={item.id}>
              <Table.Cell>
                <Stack direction="row" alignItems="center" justifyItems="flex-start">
                    <Button disabled={isLoading} onClick={() => onDelete(item.id)} size="xs" bg="red.500">
                        <IoClose  />
                    </Button>
                    {degreeLevel.name}
                </Stack>
              </Table.Cell>
              <Table.Cell>{item.fieldOfStudy}</Table.Cell>
              <Table.Cell>{item.institution}</Table.Cell>
              <Table.Cell>
                {item.startDate ? (new Date(item.startDate)).toLocaleDateString('pt-BR', {
                    timeZone: "UTC"
                }):""}</Table.Cell>
              <Table.Cell>
              {item.endDate ? (new Date(item.endDate)).toLocaleDateString('pt-BR', {
                timeZone: "UTC"
              }):""}  
              </Table.Cell>
              <Table.Cell bg={`${item.currentlyStudying ? "green":"blue"}`} textAlign="center">{item.currentlyStudying ? "Sim":"Não"}</Table.Cell>
            </Table.Row>
            )})}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}