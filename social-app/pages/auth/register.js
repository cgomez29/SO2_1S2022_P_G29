import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/react";

import { socialApi } from "../../api";
import { convertBase64 } from "../../helper/base64";

const Register = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
  });
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (datos) => {
    const { username, name, password, password2 } = datos;
    setShowError(false);
    try {
      if (password == password2) {
        // parse to base64
        let base64 = "";
        if (acceptedFiles.length != 0) {
          const file = acceptedFiles[0];
          base64 = await convertBase64(file);
        }

        const { data } = await socialApi.post("/auth/signUp", {
          username,
          name,
          password,
          image: base64,
        });

        const { status } = data;

        if (status) router.push("/");
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <Container centerContent>
      <Text
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
      >
        Register
      </Text>

      {showError && (
        <Stack spacing={3}>
          <Alert status="error">
            <AlertIcon />
            Passwords do not match
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

        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="user">Name</FormLabel>
          <Input
            id="name"
            placeholder="Name"
            {...register("name", { required: true })}
          />
          {!!errors.name && (
            <FormErrorMessage>Name is required.</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: true,
              })}
            />
          </InputGroup>
          {!!errors.password && (
            <FormErrorMessage>Password is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.password2}>
          <FormLabel htmlFor="password2">Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              id="password2"
              type="password"
              placeholder="Confirm Password"
              {...register("password2", {
                required: true,
              })}
            />
          </InputGroup>
          {!!errors.password2 && (
            <FormErrorMessage>Password is required.</FormErrorMessage>
          )}
        </FormControl>

        <section className="container">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag n drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Image</h4>
            <ul>{files}</ul>
          </aside>
        </section>
        <FormControl>
          <FormHelperText>
            <Link href="/">Back</Link>{" "}
          </FormHelperText>
        </FormControl>

        <Button mt={3} colorScheme="teal" size="lg" type="submit" w="100%">
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
