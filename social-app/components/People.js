import { Box, Button, Container, Image, Link, Text } from "@chakra-ui/react";
import { IoPersonAddSharp } from "react-icons/io5";
import { PATH_IMG } from "../constants/constants";
import { DEAFAUL_IMAGE } from "../constants/constants";
import { socialApi } from "../api";

const People = ({ user, userReq, update }) => {
  const { idUsuario, name, image, username } = user;

  const addFriend = async () => {
    try {
      await socialApi.post("/friend/sendFriendRequest", {
        idUsuario: userReq,
        idUsuarioB: idUsuario,
      });
    } catch (error) {
      //console.log(error);
    }
    update();
  };

  return (
    <Box mb={4}>
      <Container>
        <Box display="flex" pt={7} pl={7}>
          <Box>
            <Image
              src={image === "" ? DEAFAUL_IMAGE : `${PATH_IMG}${image}`}
              borderRadius="full"
              objectFit="cover"
              boxSize={{ xl: "80px", md: "80px", base: "40px" }}
              alt="picture"
            />
          </Box>
          <Box pt={1} mb="auto" pl={3}>
            <Text fontSize={{ xl: "xl", md: "xl", base: "sm" }}>
              <Link>{name}</Link>
            </Text>
            <Text fontSize={{ xl: "lg", md: "lg", base: "xs" }}>
              @{username}
            </Text>
          </Box>
          <Box ml="auto" mt="auto" mb="auto">
            <Button leftIcon={<IoPersonAddSharp />} onClick={addFriend}>
              Add
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default People;
