import { useEnumsContext } from "@/_context/EnumsContext"
import { ApplicationStatus } from "@/_types/Job"
import { Flex } from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa"
import { FiLoader, FiX } from "react-icons/fi"

export const ApplicationStatusComponent = ({ status }: { status: ApplicationStatus})=>{
    const { enums } = useEnumsContext();
    const ApplicationStatus = enums?.ApplicationStatus;

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
                status == "accepted" ? "green.700":"orange.700"
            }
            alignItems="center">
                {status == "rejected" && <FiX />}
                {status == "accepted" && <FaCheckCircle />}
                {status == "pending" && <FiLoader />}
            {
                ApplicationStatus?.filter( item => item.value == status)[0].label ?? status
            }
        </Flex>
    )
}