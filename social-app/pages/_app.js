import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Main from "../layout/Main";
import { AuthProvider } from "../context/auth";
import theme from "../lib/theme";

function MyApp({ Component, session, pageProps }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <ChakraProvider>
          <Main>
            <Component {...pageProps} />
          </Main>
        </ChakraProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
