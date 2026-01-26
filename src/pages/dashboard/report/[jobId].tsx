import { SelectComponent } from "@/_components/ui/Select/SelectComponent";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { Sidebar } from "@/_components/ui/sidebar/Index";
import { useAuthContext } from "@/_context/AuthContext";
import { useEnumsContext } from "@/_context/EnumsContext";
import { maxLetters, useCountLetters } from "@/_hooks/useCountLetters";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Button, Field, Flex, Text, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

export const reportValidation = z.object({
    reason: z.array(z.string().trim().nonempty({ message: "Escolha uma opção."})).min(1, {message: "Escolha uma opção válida."}),
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}).max(maxLetters, { message: `Máximo de ${maxLetters} de caracteres.`})
});

export type ReportFormData = z.infer<typeof reportValidation>;

export default function({ jobId }: { jobId: string }){
    const {handleSubmit, register, control, formState: { errors, isSubmitting }} = useForm<ReportFormData>({
        mode: "all",
        criteriaMode:"all",
        resolver: zodResolver(reportValidation)
    });
    const {countLetters, setCountLetters} = useCountLetters();
    const {handleServerError, serverErrors} = useServerErrors();
    const { enums } = useEnumsContext();
    const ReportReason = enums?.ReportReason;
    
    const onSubmit = async (data: ReportFormData) =>{

        try{
            const response = await getAPIClient().post("/vaga/report", {
                jobId: jobId,
                ...data
            });
            toast.success(response.data.data.message);
        }catch(error: any){
            handleServerError(error);
        }

    }

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Denunciar vaga</title>
            </Head>
            <Sidebar>
                <Flex direction="column" gap="4">
                    <Text>Denunciar vaga</Text>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex gap="4" direction="column">
                            <SelectComponent 
                                control={control}
                                title="Motivo da denúncia"
                                items={ReportReason}
                                serverErrors={serverErrors}
                                name="reason"
                                error={errors.reason?.message}
                            />
                            <Field.Root
                                invalid={!!errors.description || !!serverErrors.description}
                                >
                                <Field.Label>Digite um feedback para o candidato:</Field.Label>
        
                                <Textarea
                                    rows={10}
                                    size="lg"
                                    {...register("description", {
                                    onChange: (e) => setCountLetters(e.target.value.length),
                                    })}
                                />
        
                                <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                                <ServerErrors serverErrors={serverErrors} field="description" />
        
                                <Field.HelperText
                                    color={countLetters >= maxLetters ? "red" : ""}
                                >
                                    {countLetters}/{maxLetters}
                                </Field.HelperText>
                                </Field.Root>
                            </Flex>
                        <Button 
                            mt="4"
                            type="submit"
                            bg="button.cta"
                        >Salvar</Button>
                    </form>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    
    const { params } = ctx;
    const jobId = params?.jobId as string; // Extrai o id da URL
    
    return{
        props:{
            jobId,
        }
    }
});