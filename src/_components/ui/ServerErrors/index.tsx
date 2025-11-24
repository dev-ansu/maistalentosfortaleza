import { Field } from "@chakra-ui/react"

export const ServerErrors = ({serverErrors, field}: { serverErrors: Record<string, string[]>, field: string})=>{
    if (!serverErrors[field]) return null;
    return (
        <>
            {serverErrors[field]?.map((msg, i) => (
                <Field.ErrorText key={i}>{msg}</Field.ErrorText>
            ))}
        </>
    )
}