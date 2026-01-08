import { ChakraProvider, MenuContext } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { system } from "../theme/theme";
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/_context/AuthContext";
import { ToastContainer } from "react-toastify";
import { EnumsProvider } from "@/_context/EnumsContext";
import { MenuProvider } from "@/_context/MenuContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute='class'>
        <AuthProvider>
          <EnumsProvider>
            <MenuProvider>
              <Component {...pageProps} />
            </MenuProvider>
          <ToastContainer position="top-right" autoClose={3000}/>
          </EnumsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
    
  );
}
