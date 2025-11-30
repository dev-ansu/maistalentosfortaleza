import { ReactNode } from "react"
import {
  useColorModeValue,
} from "@/_components/ui/color-mode"
import {IconButton,CloseButton,Flex,Icon,DrawerContent,Text,useDisclosure,BoxProps,FlexProps,Box} from "@chakra-ui/react"
import { Drawer } from "@chakra-ui/react"
import {FiMenu, FiSettings} from "react-icons/fi"
import { IconType } from "react-icons"
import Link from "next/link"
import { useAuthContext } from "@/_context/AuthContext";
import { useMenu } from "@/_hooks/useMenu";
import { MenuIcons } from "@/_constants/icons"

export interface MenuItem {
    label: string;
    icon: string; // Agora é string com o nome do ícone
    route: string;
}

export interface LinkItemsProps {
    label: string;
    icon: string; // Mude para string
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
    
    const menuItems = useMenu();
    
    const { logoutUser, haveResume, user } = useAuthContext();

    const handleLogout = async()=>{
        await logoutUser();
    }


    // if(user?.userType === USER_TYPES.candidate && haveResume) {LinkItems.push({ name: 'Currículo', icon: IoDocumentTextOutline, route: "/candidate/curriculo"})}
    // if(user?.userType === USER_TYPES.candidate && haveResume)  {LinkItems.push({ name: 'Candidaturas', icon: BsSend, route: "/candidate/candidaturas"})}
    // if(user?.userType === USER_TYPES.company)  {LinkItems.push({name: 'Perfil', icon: CgProfile, route: "/company/perfil"})}
    
    
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
            {menuItems.map( (item: LinkItemsProps) => {
                const icon = MenuIcons[item.icon];
                return(
                <NavItem icon={icon} route={item.route} key={item.label}>
                    {item.label}
                </NavItem>
            )})}

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