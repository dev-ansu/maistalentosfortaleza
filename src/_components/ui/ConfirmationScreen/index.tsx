import {
  Flex,
  Box,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

interface ConfirmationScreenProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ConfirmationScreen = ({
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmationScreenProps) => {
  if (!isOpen) return null;

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={999}
      justify="center"
      align="center"
      backdropFilter="blur(6px)"
      bg="rgba(0, 0, 0, 0.4)"
    >
      
      <Box
        bg="white"
        borderRadius="lg"
        p={6}
        w="90%"
        maxW="420px"
        boxShadow="xl"
      >
        <Text color="black" fontSize="lg" fontWeight="bold" mb={2}>
          {title}
        </Text>

        <Text color="gray.600" mb={6}>
          {message}
        </Text>

        <HStack justify="flex-end">
          <Button variant="ghost" _hover={{ color:"white" }} color="black" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button bg="button.cta" _hover={{ bg:"#d18b22ff" }} onClick={onConfirm}>
            {confirmText}
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};
