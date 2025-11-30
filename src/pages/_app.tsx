import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { system } from "./theme";
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/_context/AuthContext";
import { ToastContainer } from "react-toastify";
import { EnumsProvider } from "@/_context/EnumsContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute='class'>
        <AuthProvider>
          <EnumsProvider>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000}/>
          </EnumsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
    
  );
}
