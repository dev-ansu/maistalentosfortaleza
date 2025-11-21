import { Tabs, Text } from "@chakra-ui/react"
import { FaSchool } from "react-icons/fa"
import { LuUser } from "react-icons/lu"
import { MdInterests, MdLanguage, MdWorkHistory } from "react-icons/md"
import { PiStudentBold } from "react-icons/pi"

export const TabList = ()=>{
    return(
        <Tabs.List maxW="full">
            <Tabs.Trigger title="Informações pessoais" value="Informações pessoais">
                <LuUser />
                <Text display={{ base:"none", md:"block" }}> informações pessoais</Text>
            </Tabs.Trigger>
            <Tabs.Trigger title="Escolaridade" value="Escolaridade">
                <FaSchool />
                <Text display={{ base:"none", md:"block" }}> Escolaridade</Text>
            </Tabs.Trigger>
            <Tabs.Trigger title="Cursos" value="Cursos">
                <PiStudentBold />
                <Text display={{ base:"none", md:"block" }}> Cursos</Text>
            </Tabs.Trigger>
            <Tabs.Trigger title="Experiência" value="Experiência">
                <MdWorkHistory />
                <Text display={{ base:"none", md:"block" }}> Experiência</Text>
            </Tabs.Trigger>
            <Tabs.Trigger title="Idiomas" value="Idiomas">
                <MdLanguage />
                <Text display={{ base:"none", md:"block" }}> Idiomas</Text>
            </Tabs.Trigger>
            <Tabs.Trigger title="Áreas de interesse" value="Áreas de interesse">
                <MdInterests />
                <Text display={{ base:"none", md:"block" }}> Áreas de interesse</Text>
            </Tabs.Trigger>
        </Tabs.List>
    )
}