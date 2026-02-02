import { useEnumsContext } from "@/_context/EnumsContext"
import { Flex } from "@chakra-ui/react"


export type ReportReasonType = "fake_job" | "scam" | "misleading_salary" | "abusive_description" | "discrimination" | "spam" | "expired_position" | "other"


export const ReportReasonComponent = ({ status }: { status: ReportReasonType})=>{
    const { enums } = useEnumsContext();
    const ReportReason = enums?.ReportReason;

    return(
        <Flex 
            alignSelf="flex-start"
            py="0.5"
            px="2"
            width="max-content"
            gap="0.5"
            rounded="sm"
            alignItems="center">
            {
                ReportReason?.filter( item => item.value == status)[0].label ?? status
            }
        </Flex>
    )
}