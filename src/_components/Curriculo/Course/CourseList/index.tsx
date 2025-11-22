import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CourseListProps } from "@/_types/CandidateProfile";
import { Button, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import z from "zod";

const deleteCourseSchema = z.object({
    id: z.uuid("Id inválido.")
});

interface CourseListPropsComponent {
  courseList: CourseListProps[];
  setCourseList: React.Dispatch<React.SetStateAction<CourseListProps[]>>;
}

export const CourseList = ({ courseList, setCourseList }: CourseListPropsComponent)=>{

  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, serverErrors } = useServerErrors();

  const onDelete = async(id: string)=>{
        setIsLoading(true);
     try {
        const data = deleteCourseSchema.parse({ id });
        try{
            const response = await getAPIClient().delete(`/candidate/course/${data.id}`);
            setCourseList((prev) => prev.filter(item => item.id !== data.id));
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
            <Table.ColumnHeader>Curso</Table.ColumnHeader>
            <Table.ColumnHeader>Instituição</Table.ColumnHeader>
            <Table.ColumnHeader>Data de conclusão</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courseList && courseList.map((item) => {
            return(
            <Table.Row key={item.id}>
              <Table.Cell>
                <Stack direction="row" alignItems="center" justifyItems="flex-start">
                    <Button disabled={isLoading} onClick={() => onDelete(item.id)} size="xs" bg="red.500">
                        <IoClose  />
                    </Button>
                    {item.title}
                </Stack>
              </Table.Cell>
              <Table.Cell>{item.institution}</Table.Cell>
              <Table.Cell>
                {item.completionDate ? (new Date(item.completionDate)).toLocaleDateString('pt-BR', {
                    timeZone: "UTC"
                }):""}</Table.Cell>
            </Table.Row>
            )})}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}