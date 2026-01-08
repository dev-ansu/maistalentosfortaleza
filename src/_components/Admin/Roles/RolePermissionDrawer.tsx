import { 
  Button, 
  CloseButton, 
  Drawer, 
  Portal, 
  Text, 
  Box, 
  VStack, 
  HStack, 
  Checkbox,
  Heading,
  Badge,
  Flex
} from "@chakra-ui/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Role } from "./RolesTable";
import { toast } from "react-toastify";
import { getAPIClient } from "@/_services/apiClient";
import { Permission } from "../Permission/PermissionsTable";

export type PermissionsByModule = {
  [module: string]: Permission[];
};

interface RolePermissionDrawerProps {
  role: Role;
  permissions: PermissionsByModule;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const RolePermissionDrawer = ({ 
  role, 
  permissions, 
  open, 
  setOpen 
}: RolePermissionDrawerProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    if (!open) return;

    async function loadRolePermissions() {
      try {
        setLoading(true);

        const { data } = await getAPIClient().get(
          `/admin/role-permission/${role.id}`
        );

        const ids = Object.values(data.data.permissions)
          .flat()
          .map((p: any) => p.id);

        setSelectedPermissions(ids);
      } catch (error: any) {
        toast.error("Erro ao carregar permissões do cargo");
        setSelectedPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadRolePermissions();
  }, [open, role.id]);

 
  
  const handleSelectAllInModule = (module: string) => {
    const modulePermissions = permissions[module];
    const allModulePermissionNames = modulePermissions.map(p => p.id);
    
    setSelectedPermissions(prev => {
      const hasAll = allModulePermissionNames.every(id => prev.includes(id));
      
      if (hasAll) {
        // Remove todas as permissões deste módulo
        return prev.filter(id => !allModulePermissionNames.includes(id));
      } else {
        // Adiciona todas as permissões deste módulo
        const newPermissions = [...prev];
        allModulePermissionNames.forEach(id => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return newPermissions;
      }
    });
  };

  const handleSave = async() => {
    setLoading(true);
    try{
      const response = await getAPIClient().post("/admin/role-permission", {
        roleId: role.id,
        permissions: selectedPermissions
      });
      toast.success(response.data.message);
    }catch(error: any){
      toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <Drawer.Root size="lg" open={open} onOpenChange={(e) => setOpen(e.open)}>
     
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <VStack align="start" gap={2}>
                <Drawer.Title fontSize="xl">Gerenciar Permissões</Drawer.Title>
                <HStack>
                  <Text fontWeight="medium">Cargo:</Text>
                  <Badge colorPalette="blue" fontSize="md">
                    {role?.name}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="fg.subtle">
                  Selecione as permissões que este cargo deve ter
                </Text>
              </VStack>
            </Drawer.Header>
            
            <Drawer.Body opacity={isLoading ? 0.6 : 1} pointerEvents={isLoading ? "none" : "auto"} py={6}>
              <VStack gap={8} align="stretch">
                {Object.entries(permissions).map(([module, modulePermissions]) => (
                  <Box key={module}>
                    <Flex justify="space-between" mb={3}>
                      <Box>
                        <Heading size="md" textTransform="capitalize">
                          {module.replace('_', ' ')}
                        </Heading>
                        <Text fontSize="sm" color="fg.subtle">
                          {modulePermissions.length} permissões disponíveis
                        </Text>
                      </Box>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleSelectAllInModule(module)}
                      >
                        Selecionar todas
                      </Button>
                    </Flex>
                    
                    <VStack gap={2} align="stretch">
                      {modulePermissions.map((permission) => (
                        <HStack 
                          key={permission.name}
                          p={3} 
                          bg="bg.muted"
                          borderWidth="1px"
                          borderRadius="md"
                          _hover={{ bg: "bg.subtle" }}
                          justify="space-between"
                        >
                          <Box flex={1}>
                            <Text fontWeight="medium">{permission.name}</Text>
                            <Text fontSize="sm" color="fg.muted">
                              {permission.description}
                            </Text>
                          </Box>
                          <Checkbox.Root
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={(e) => {
                              if (e.checked) {
                                setSelectedPermissions(prev =>
                                  prev.includes(permission.id)
                                    ? prev
                                    : [...prev, permission.id]
                                );
                              } else {
                                setSelectedPermissions(prev =>
                                  prev.filter(id => id !== permission.id)
                                );
                              }
                            }}
                            size="md"
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox.Root>
                        </HStack>
                      ))}
                    </VStack>
                    
                    {/* Divider personalizado */}
                    <Box 
                      as="hr" 
                      height="1px" 
                      bg="border" 
                      border="none" 
                      mt={6}
                    />
                  </Box>
                ))}
              </VStack>
            </Drawer.Body>
            
            <Drawer.Footer borderTopWidth="1px">
              <Flex justify="space-between" w="full" align="center">
                <Text fontSize="sm" color="fg.subtle">
                  {selectedPermissions.length} permissões selecionadas
                </Text>
                <HStack>
                  <Button onClick={() => setOpen(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={isLoading}
                    colorPalette={selectedPermissions.length === 0 ? "red" : "blue"}
                  >
                    {selectedPermissions.length === 0
                      ? "Remover todas as permissões"
                      : `Salvar (${selectedPermissions.length})`}
                  </Button>
                </HStack>
              </Flex>
            </Drawer.Footer>
            
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top={4} right={4} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
      
    </Drawer.Root>
  )
}