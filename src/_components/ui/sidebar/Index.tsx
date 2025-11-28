import { ReactNode, useEffect, useState } from "react"
import {
  useColorModeValue,
} from "@/_components/ui/color-mode"
import {IconButton,CloseButton,Flex,Icon,DrawerContent,Text,useDisclosure,BoxProps,FlexProps,Box} from "@chakra-ui/react"
import { Drawer } from "@chakra-ui/react"
import { CiHome } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import {FiMenu, FiSettings} from "react-icons/fi"
import { IconType } from "react-icons"
import Link from "next/link"
import { useAuthContext } from "@/_context/AuthContext";
import { AiFillProfile } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { USER_TYPES } from "@/_constants";

interface LinkItemsProps{
    name: string;
    icon: IconType;
    route: string;
}



export function Sidebar({children}: {children: ReactNode}){
    const {open, onOpen, onClose} = useDisclosure();

    return(
        <Box minH="100vh" bg="talento.900">
            <SidebarContent onClose={onClose}
                display={{ base:"none", md:"block"}}
            >
            </SidebarContent>    
            <Drawer.Root
             open={open}
             placement="start"
             size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()}>
                </SidebarContent>  
                    
                </DrawerContent>
                
            </Drawer.Root>
            <MobileNav display={{ base:"flex", md: "none"}} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60}} p={4}>
                {children}
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps{
    onClose: ()=> void;
}



const SidebarContent = ({onClose, ...rest}: SidebarProps) =>{
    
    const { logoutUser, haveResume, user } = useAuthContext();
    let LinkItems: LinkItemsProps[] = [
        { name: 'Home', icon: CiHome, route: "/dashboard"},
    ]


    const handleLogout = async()=>{
        await logoutUser();
    }


    if(user?.userType === USER_TYPES.candidate) {LinkItems.push({ name: 'Currículo', icon: IoDocumentTextOutline, route: "/candidate/curriculo"})}
    if(user?.userType === USER_TYPES.candidate)  {LinkItems.push({ name: 'Candidaturas', icon: BsSend, route: "/candidate/candidaturas"})}
    if(user?.userType === USER_TYPES.company)  {LinkItems.push({name: 'Perfil', icon: CgProfile, route: "/company/perfil"})}
    
    
    return(
        <Box
            bg="talento.400"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: "full", md: 60}}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href="/dashboard">
                    <Flex flexDirection="column" userSelect="none" cursor="pointer">
                        <Text fontSize="2xl" fontWeight="bold">Mais Talentos</Text>                                                
                        <Text>Fortaleza</Text>
                    </Flex>
                </Link>
                <CloseButton display={{ base: "flex", md:"none"}} onClick={onClose}/>
            </Flex>
            {LinkItems.map( (item: LinkItemsProps) => (
                <NavItem icon={item.icon} route={item.route} key={item.name}>
                    {item.name}
                </NavItem>
            ))}

            {/* 🔥 BOTÃO DE SAIR */}
            <Box onClick={handleLogout} position="absolute" bottom="4" w="100%" px="4">
                <Flex
                align="center"
                p="3"
                borderRadius="lg"
                bg="red.500"
                color="white"
                cursor="pointer"
                _hover={{ bg: "red.600" }}
                onClick={() => console.log("SAIR")}
                >
                <Icon as={FiSettings} mr="3" />
                <Text fontWeight="medium">Sair</Text>
                </Flex>
            </Box>
            
        </Box>
    )

}

interface NavItemProps extends FlexProps
{icon: IconType; children: ReactNode; route: string}

const NavItem = ({icon, children, route, ...rest}: NavItemProps )=>{
    return (
        <Link style={{ textDecoration: "none"}} href={route}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="1g"
                role="group"
                cursor="pointer"
                _hover={{
                    bg:"talento.900",
                    color:"white"
                }}
                {...rest}
            >
                {icon && (
                    <Icon 
                        mr="4"
                        fontSize="16"
                        as={icon}
                        _groupHover={{
                            color:"white"
                        }}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}

interface MobileProps extends FlexProps{
    onOpen: () => void;
}

const MobileNav = ({onOpen, ...rest}: MobileProps)=>{
    return(
        <Flex
            ml={{base: 0, md: 60}}
            px={{base: 4, md: 24}}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.700")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton 
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
            >
                <FiMenu />
            </IconButton>
            <Flex ml="4" flexDirection="column">
                <Text fontSize="xl" fontWeight="bold">Mais Talentos</Text>                                                
                <Text>Fortaleza</Text>
            </Flex>

        </Flex>
    )
}