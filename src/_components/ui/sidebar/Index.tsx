import { ReactNode, useEffect, useRef, useState } from "react"
import {
  useColorModeValue,
} from "@/_components/ui/color-mode"
import {IconButton,CloseButton,Flex,Icon,DrawerContent,Text,useDisclosure,BoxProps,FlexProps,Box} from "@chakra-ui/react"
import { Drawer } from "@chakra-ui/react"
import {FiChevronDown, FiChevronUp, FiMenu, FiUser} from "react-icons/fi"
import { IconType } from "react-icons"
import Link from "next/link"
import { useAuthContext } from "@/_context/AuthContext";
import { MenuIcons } from "@/_constants/icons"
import { useMenuContext } from "@/_context/MenuContext"
import { FaSignOutAlt } from "react-icons/fa"
import { useEnumsContext } from "@/_context/EnumsContext"
import { bgStatus, StatusKey } from "@/_components/Admin/List/components/PendingCompaniesTable"


export interface MenuItem {
  label: string;
  icon: string;
  route?: string; // Agora é opcional, pois itens com submenu não têm rota direta
  children?: MenuItem[]; // Para submenus
}

export interface LinkItemsProps {
    label: string;
    icon: string; // Mude para string
    route: string;
}

function Topbar(){
    const { enums } = useEnumsContext();
    const { user, logoutUser } = useAuthContext();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleTopMenu = (e: React.MouseEvent) => {
        e.stopPropagation(); // impede o clique de ser capturado pelo listener global
        setOpen((prev) => !prev);
    };

    const handleLogout = async()=>{
        await logoutUser();
    }    
    
    useEffect(() => {

        const handleClickOutside = (e: MouseEvent)=>{
            if(ref.current && !ref.current.contains(e.target as Node)){
                setOpen(false);
            }
        }

        if(open){
            document.addEventListener("click", handleClickOutside)
        }

        return () => document.removeEventListener("click", handleClickOutside)
    }, [open])


    return(
        <>
        <Flex id="topbar" bg="talento.400" position="relative" w="full" h="10" p="2" justifyContent="flex-end">
            <Flex  px="4" borderRadius="lg"   alignItems="center" justifyContent={`${
                user?.userType && "company" && user?.company ? "space-between":"flex-end"
            }`} w="full">
                {user?.userType == "company" && user?.company && 
                    <Flex bg={bgStatus[user.company?.verificationStatus as StatusKey]} px="1.5" rounded="sm" fontSize="12px">
                        Status: {enums ? enums.VerificationStatus.filter( i  => i.value == user.company?.verificationStatus )[0].label:""}
                    </Flex>
                }
                <Flex borderWidth="1px" cursor="pointer" onClick={handleTopMenu} alignItems="center">
                    <Text fontSize="12px"> 
                        {user?.name} 
                    </Text>
                    { !open &&  <FiChevronDown style={{ marginTop: "4px"}} /> }
                    { open &&  <FiChevronUp style={{ marginTop: "4px"}} /> }
                </Flex>
            </Flex>
            {open && 
                <Flex zIndex="1" transition="all" boxShadow="2xl" ref={ref} borderWidth="2px" rounded="xl" direction="column" gap="2" position="absolute" top="8" bg="talento.400" px="6" py="2" w="250px" right="0">
                    <Link href="/candidate/perfil">
                        <Flex gap="1" fontSize="14px" alignItems="center">
                            <FiUser /> Perfil
                        </Flex>
                    </Link>
                    <Flex borderWidth="1px"></Flex>
                    <Box onClick={handleLogout}  >
                    <Flex
                            px="2" py="1"
                            align="center"
                            borderRadius="lg"
                            bg="red.500"
                            color="white"
                            cursor="pointer"
                            _hover={{ bg: "red.600" }}
                            gap="1"
                            w="full"
                            >
                            <Icon as={FaSignOutAlt}  />
                            <Text fontWeight="medium">Sair</Text>
                        </Flex>
                    </Box>
                </Flex>
            }
        </Flex>
        </>
    )
}

export function Sidebar({children}: {children: ReactNode}){
    const {open, onOpen, onClose} = useDisclosure();
    const { user } = useAuthContext();

    return(
        <Box id="sidebar" minH="100vh" bg="talento.900">
            <SidebarContent onClose={onClose}
                display={{ base:"none", md:"block"}}
            >
            </SidebarContent>    
            <Drawer.Root
             id="sibebar_drawer"
             open={open}
             placement="start"
             size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()}>
                </SidebarContent>  
                    
                </DrawerContent>
                
            </Drawer.Root>
            <MobileNav className="mobile_nav" display={{ base:"flex", md: "none"}} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60}}>
                <Topbar />
                <Box p="2" px="4">
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps{
    onClose: ()=> void;
}



const SidebarContent = ({onClose, ...rest}: SidebarProps) =>{
    
    const { menuItems } = useMenuContext();   
    
    return (
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

            {menuItems.map(item => (
              <SidebarItem key={item.label} item={item} />
            ))}        
            
        </Box>
    )
}

const SidebarItem = ({ item }: { item: MenuItem }) => {
  const [open, setOpen] = useState(false);

  const IconComp = MenuIcons[item.icon];

  // Se NÃO tiver submenu → renderiza normal
  if (!item.children) {
    return (
      <NavItem icon={IconComp} route={item.route!}>
        {item.label}
      </NavItem>
    );
  }

  // Se tiver children → é submenu
  return (
    <Box>
      <Flex
        align="center"
        p="4"
        mx="4"
        cursor="pointer"
        _hover={{ bg: "talento.900", color: "white" }}
        onClick={() => setOpen(prev => !prev)}
      >
        <Icon as={IconComp} mr="4" fontSize="16" />
        <Text flex="1">{item.label}</Text>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </Flex>

      {open && (
        <Box ml="6" borderLeftWidth="1px" pl="3">
          {item.children.map(child => {
            const CIcon = MenuIcons[child.icon];
            return (
              <NavItem
                key={child.label}
                icon={CIcon}
                route={child.route!}
                p="3"
                fontSize="14px"
              >
                {child.label}
              </NavItem>
            );
          })}
        </Box>
      )}
    </Box>
  );
};


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