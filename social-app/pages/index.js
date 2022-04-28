import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";

export default function Home() {
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClick = () => setShow(!show);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ username, password }) => {
    setShowError(false);

    await signIn("credentials", { username, password });
    router.replace("/dashboard");
  };

  return (
    <Container centerContent>
      <Text
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
      >
        Welcome
      </Text>

      {showError && (
        <Stack spacing={3}>
          <Alert status="error">
            <AlertIcon />
            There was an error processing your request
          </Alert>
        </Stack>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="user">Username</FormLabel>
          <Input
            id="username"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          {!!errors.username && (
            <FormErrorMessage>Username is required.</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: true,
              })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {!!errors.password && (
            <FormErrorMessage>Password is required.</FormErrorMessage>
          )}
          <FormHelperText>
            {" "}
            <Link href="/auth/register"> Register</Link>{" "}
          </FormHelperText>
        </FormControl>
        <Button mt={3} colorScheme="teal" size="lg" type="submit" w="100%">
          LogIn
        </Button>
      </form>
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
