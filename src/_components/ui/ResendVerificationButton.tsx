// components/ResendVerificationButton.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Alert,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "@/_context/AuthContext";
import {toast} from "react-toastify";

export function ResendVerificationButton() {
    const { pendingVerificationUser, resendVerification, showResendButton } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);


    if (!showResendButton || !pendingVerificationUser) {
        return null;
    }

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await resendVerification();
            
            // Feedback visual com toast do Chakra
            toast.info("Verifique sua caixa de entrada (incluindo spam).");
        } catch (error: any) {
            // O erro já é tratado no contexto, mas podemos adicionar um toast extra
            toast.error(error.message || "Não foi possível reenviar o link.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box 
            mt={4} 
            p={4} 
            borderWidth="1px" 
            borderRadius="lg" 
            bg="gray.50"
            boxShadow="sm"
        >
        
            <Alert.Root
                status="warning" 
                variant="subtle"
                borderRadius="md"
                mb={4}
            >
                <Box flex="1">
                    <Alert.Title color="black" fontWeight="bold">E-mail não verificado!</Alert.Title>
                    <Alert.Description>
                        <Text color="black" mt={1}>
                            {pendingVerificationUser.hasValidToken 
                                ? "Verifique sua caixa de entrada (incluindo spam)."
                                : "Seu link de verificação expirou. Solicite um novo link abaixo."
                            }
                        </Text>
                    </Alert.Description>
                </Box>
            </Alert.Root>
            
            <Button
                colorScheme="blue"
                onClick={handleResend}
                disabled={isLoading || !pendingVerificationUser.canResend}
                loading={isLoading}
                loadingText="Enviando..."
                width="full"
                size="md"
                _hover={{
                    bg: "blue.600",
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                }}
                _active={{
                    bg: "blue.700",
                    transform: "translateY(0)"
                }}
                transition="all 0.2s"
            >
                Reenviar link de verificação
            </Button>
            
            {!pendingVerificationUser.canResend && (
                <Text 
                    color="gray.500" 
                    fontSize="sm" 
                    mt={2}
                    textAlign="center"
                >
                    Aguarde alguns minutos antes de solicitar novamente.
                </Text>
            )}
            
        </Box>
    );
}