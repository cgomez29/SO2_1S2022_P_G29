import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue("#ffffff40", "#20202380")}
      css={{ backdropFilter: "blur(10px)" }}
      zIndex={1}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.lg"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="/dashboard">Home</LinkItem>
          <LinkItem href="/profile">My Profile</LinkItem>
          <LinkItem href="/dashboard/friends">Add Friends</LinkItem>
          <LinkItem href="/dashboard/notifications">Notificacions</LinkItem>
          <Button onClick={signOut}>Log out</Button>
        </Stack>
        <Box flex={1} align="right">
          <Box ml={2} display={{ base: "inline-block", md: "none" }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <NextLink href={"/dashboard"} passHref>
                  <MenuItem as={Link}>Home</MenuItem>
                </NextLink>
                <NextLink href={"/profile"} passHref>
                  <MenuItem as={Link}>Profile</MenuItem>
                </NextLink>
                <NextLink href={"/dashboard/friends"} passHref>
                  <MenuItem as={Link}>Add Friends</MenuItem>
                </NextLink>
                <NextLink href={"/dashboard/notifications"} passHref>
                  <MenuItem as={Link}>Notifications</MenuItem>
                </NextLink>
                <NextLink href={"/"} passHref>
                  <MenuItem as={Link} onClick={signOut}>
                    Log out
                  </MenuItem>
                </NextLink>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const LinkItem = ({ href, children }) => {
  return (
    <NextLink href={href} scroll={false} passHref>
      <Link p={2}>{children}</Link>
    </NextLink>
  );
};

export default NavBar;
