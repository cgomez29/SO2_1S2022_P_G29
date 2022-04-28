import { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IoPencil } from "react-icons/io5";
import CustomModal from "../components/CustomModal";
import { getSession, signIn } from "next-auth/react";
import { PATH_IMG } from "../constants/constants";
import { DEAFAUL_IMAGE } from "../constants/constants";
import { socialApi } from "../api";

const Profile = ({ data }) => {
  const [user, setUser] = useState(data);
  const [image, setImage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef(null);
  const toast = useToast();

  const imageDefault = () => {
    if (user?.imagen) {
      return `${PATH_IMG}${user.imagen}`;
    }
    return DEAFAUL_IMAGE;
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onClickPhoto = () => {
    inputRef.current?.click();
  };

  const onChangePhoto = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const sendData = async () => {
    if (user?.confirm !== "") {
      try {
        await socialApi.post("/auth/signIn", {
          username: user?.username,
          password: user?.confirm,
        });

        await socialApi.put("/user/updateProfile", {
          idUsuario: user?.idUsuario,
          username: user?.username,
          name: user?.name,
          password: user?.password,
          image: image,
        });

        setUser({ ...user, confirm: "", password: "" });
        onClose();
        toast({
          title: "Success",
          position: "top-right",
          description: "Profile updated",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        await signIn("credentials", {
          username: user?.username,
          password: user?.confirm,
        });
      } catch (error) {
        toast({
          title: "Error",
          position: "top-right",
          description: "Password incorrect",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Confirm password",
        position: "top-right",
        description: "you need to confirm your password",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={6}>
      <Container maxW="container.md" centerContent>
        <Text fontSize="65px">Profile</Text>
      </Container>

      <Container maxW="container.md" display={{ xl: "flex", md: "flex" }}>
        <Box
          width={{
            base: "100%", // 0-48em
            md: "65%", // 48em-80em,
            xl: "65%", // 80em+
          }}
        >
          <FormControl pb={3}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={handleInputChange}
              value={user?.name}
            />
          </FormControl>
          <FormControl pb={3}>
            <FormLabel htmlFor="userName">Username</FormLabel>
            <Input
              id="userName"
              name="username"
              type="text"
              onChange={handleInputChange}
              value={user?.username}
            />
          </FormControl>
          <FormControl pb={3}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={handleInputChange}
              value={user?.password}
            />
          </FormControl>
        </Box>

        <Box
          margin="auto"
          p={{ base: 4, md: 0 }}
          width={{
            base: "100%", // 0-48em
            md: "35%", // 48em-80em,
            xl: "35%", // 80em+
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.07,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <Container centerContent cursor="pointer" onClick={onClickPhoto}>
              <Image
                borderRadius="full"
                objectFit="cover"
                boxSize="210px"
                src={image === "" ? imageDefault() : image}
                alt="Dan Abramov"
              />
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={onChangePhoto}
                ref={inputRef}
              />
            </Container>
          </motion.div>
        </Box>
      </Container>
      <Container pt={4} centerContent>
        <Button
          leftIcon={<IoPencil />}
          colorScheme="teal"
          variant="solid"
          size="lg"
          onClick={() => {
            if (user?.username !== "" && user?.name !== "") onOpen();
            else {
              toast({
                title: "Error",
                position: "top-right",
                description: "You need to complete the field username and name",
                status: "error",
                duration: 4000,
                isClosable: true,
              });
            }
          }}
        >
          Save
        </Button>
        <CustomModal
          header={"Confirm Password"}
          body={
            <Input
              id="confirm"
              name="confirm"
              type="password"
              onChange={handleInputChange}
              value={user?.confirm}
            />
          }
          isOpen={isOpen}
          onClose={onClose}
          handlerSend={sendData}
        />
      </Container>
    </Box>
  );
};

export async function getServerSideProps(ctx) {
  try {
    const session = await getSession(ctx);

    const { idUsuario, image, name, username } = session?.user;

    return {
      props: {
        data: {
          idUsuario,
          name,
          username,
          password: "",
          imagen: image,
          confirm: "",
        },
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
      },
    };
  }
}

export default Profile;
