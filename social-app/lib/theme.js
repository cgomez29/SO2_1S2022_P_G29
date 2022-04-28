import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      bg: "#202023",
    },
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({ config, styles });
export default theme;
