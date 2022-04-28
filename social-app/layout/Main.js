import { Box, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

const Main = ({ children }) => {
  const { route } = useRouter();

  return (
    <Box>
      {route !== "/" && route !== "/auth/register" ? <NavBar /> : null}
      <Container maxW="container.md" pt={14}>
        {children}
      </Container>
    </Box>
  );
};

export default Main;
