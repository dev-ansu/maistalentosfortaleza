import { useEnumsContext } from "@/_context/EnumsContext"
import { ApplicationStatus } from "@/_types/Job"
import { Flex } from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa"
import { FiLoader, FiX } from "react-icons/fi"

export type ReportStatusType = "pending" | "under_review" | "resolved" | "rejected";


export const ReportStatusComponent = ({ status }: { status: ReportStatusType})=>{
    const { enums } = useEnumsContext();
    const ReportStatus = enums?.ReportStatus;

    return(
        <Flex 
            alignSelf="flex-start"
            py="0.5"
            px="2"
            width="max-content"
            gap="0.5"
            rounded="sm"
            bg={
                status == "rejected" ? "red.700":
                status == "resolved" ? "green.700": status == "under_review" ? "blue.700":"orange.700"
            }
            alignItems="center">
                {status == "rejected" && <FiX />}
                {status == "resolved" && <FaCheckCircle />}
                {status == "pending" && <FiLoader />}
                {status == "under_review" && <FiLoader />}
            {
                ReportStatus?.filter( item => item.value == status)[0].label ?? status
            }
        </Flex>
    )
}