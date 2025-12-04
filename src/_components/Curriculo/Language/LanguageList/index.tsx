import { LANGUAGE_PROFICIENCY } from "@/_constants";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { LanguageListProps } from "@/_types/CandidateProfile";
import { Button, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import z from "zod";

  const deleteLanguageSchema = z.object({
      id: z.uuid("Id inválido.")
  });

interface LanguageListPropsComponent {
  languageList: LanguageListProps[];
  setLanguageList: React.Dispatch<React.SetStateAction<LanguageListProps[]>>;
}

export const LanguageList = ({ languageList, setLanguageList }: LanguageListPropsComponent)=>{

  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, serverErrors } = useServerErrors();

  const onDelete = async(id: string)=>{
        setIsLoading(true);
     try {
        const data = deleteLanguageSchema.parse({ id });
        try{
            const response = await getAPIClient().delete(`/candidate/language/${data.id}`);
            setLanguageList((prev) => prev.filter(item => item.id !== data.id));
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
            <Table.ColumnHeader>Idioma</Table.ColumnHeader>
            <Table.ColumnHeader>Proficiência</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {languageList && languageList.map((item) => {
            const proficiency = LANGUAGE_PROFICIENCY.filter( i => item.proficiency == i.id)
            return(
            <Table.Row key={item.id}>
              <Table.Cell>
                <Stack direction="row" alignItems="center" justifyItems="flex-start">
                    <Button disabled={isLoading} onClick={() => onDelete(item.id)} size="xs" bg="red.500">
                        <IoClose  />
                    </Button>
                    {item.name}
                </Stack>
              </Table.Cell>
              <Table.Cell>{proficiency[0].name}</Table.Cell>
            </Table.Row>
            )})}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}