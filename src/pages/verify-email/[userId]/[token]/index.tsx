// pages/verify-email/[[...params]].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  Button,
  VStack,
  Center,
  Flex,
  Link as ChakraLink
} from "@chakra-ui/react";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import Link from "next/link";

export default function(){
  const router = useRouter();
  const params = router.query // params será um objeto {userId, token}; 
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');


  useEffect(() => {

    if (params && Object.values(params).length === 2) {
      const {userId, token} = params;
      verifyEmail(userId as string, token as string);
    } else if (router.isReady) {
      // Se não tiver parâmetros corretos, mostrar erro
      setStatus('error');
      setMessage('Link de verificação inválido ou incompleto');
    }
  }, [params, router.isReady]);

  const verifyEmail = async (userId: string, token: string) => {
    try {
      // Chamar a API do backend
      const response = await getAPIClient().get(
        `/verify-email/${userId}/${token}`
      );
      
      setStatus('success');
      setMessage('E-mail verificado com sucesso!');
      setUserEmail(response.data.data?.email || '');
      
      toast.success("E-mail verificado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 3000);
      
    } catch (error: any) {
      setStatus('error');
      console.log(error)
      const errorMsg = error.response?.data?.message || 'Erro ao verificar e-mail';
      setMessage(errorMsg);
      
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Center minH="70vh">
        <Box 
          w="full" 
          maxW="md" 
          p={8} 
          borderWidth={1} 
          borderRadius="xl" 
          boxShadow="xl"
          bg="white"
        >
          <VStack textAlign="center">
            {status === 'loading' && (
              <>
                <Spinner 
                  color="blue.500"
                  size="xl"
                />
                <Heading size="lg" color="blue.600">
                  Verificando seu e-mail...
                </Heading>
                <Text color="gray.600">
                  Aguarde enquanto validamos seu link de verificação.
                </Text>
              </>
            )}
            
            {status === 'success' && (
              <>
                <Box 
                  w={20} 
                  h={20} 
                  borderRadius="full" 
                  bg="green.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="4xl" color="green.500">
                    ✓
                  </Text>
                </Box>
                <Heading size="lg" color="green.600">
                  E-mail verificado!
                </Heading>
                <Text color="gray.600">
                  {userEmail && (
                    <>
                      O e-mail <Text as="span" fontWeight="bold">{userEmail}</Text> foi verificado com sucesso.
                      <br />
                    </>
                  )}
                  Você será redirecionado para a página de login em instantes.
                </Text>
                <Alert.Root justifyContent="center" status="success" variant="subtle" borderRadius="md">
                  <Box>
                    <Alert.Title>Conta ativada!</Alert.Title>
                    <Alert.Description>
                      Agora você pode fazer login normalmente.
                    </Alert.Description>
                  </Box>
                </Alert.Root>
                <Button 
                  colorScheme="green" 
                  onClick={() => router.push('/login')}
                  width="full"
                >
                  Ir para Login Agora
                </Button>
              </>
            )}
            
            {status === 'error' && (
              <>
                <Box 
                  w={20} 
                  h={20} 
                  borderRadius="full" 
                  bg="red.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="4xl" color="red.500">
                    ✗
                  </Text>
                </Box>
                <Heading size="lg" color="red.600">
                  Erro na verificação
                </Heading>
                <Alert.Root justifyContent="center" status="error" variant="subtle" borderRadius="md">
                  <Box>
                    <Alert.Title>Não foi possível verificar</Alert.Title>
                    <Alert.Description>
                      {message}
                    </Alert.Description>
                  </Box>
                </Alert.Root>
                
                <Text color="gray.600" fontSize="sm">
                  Possíveis causas:
                  <br />
                  • O link já foi utilizado
                  <br />
                  • O link expirou (validade: 30 minutos)
                  <br />
                  • Link malformado ou inválido
                </Text>
                
                <Flex gap={3} mt={4} width="full">
                  <Button 
                    colorScheme="blue" 
                    onClick={() => router.push('/login')}
                    flex={1}
                  >
                    Ir para Login
                  </Button>
                  <Button 
                    variant="outline" 
                    color="black"
                    _hover={{ color: "white"}}
                    onClick={() => router.push('/resend-verification')}
                    flex={1}
                  >
                    Solicitar novo link
                  </Button>
                </Flex>
                
                <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">
                    Precisa de ajuda?{" "}
                    <Link href="/contact" passHref>
                      <ChakraLink color="blue.500" fontWeight="medium">
                        Entre em contato
                      </ChakraLink>
                    </Link>
                  </Text>
                </Box>
              </>
            )}
          </VStack>
        </Box>
      </Center>
    </Container>
  );
}