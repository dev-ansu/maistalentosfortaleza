import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { system } from "./theme";
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute='class'>
        <AuthProvider>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000}/>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
    
  );
}
