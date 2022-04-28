import { Box, Container, Text } from "@chakra-ui/react";
import People from "../../components/People";
import { socialApi } from "../../api";
import { getSession } from "next-auth/react";
import { useState } from "react";

const Friends = ({ data, idUsuario }) => {
  const [friends, setFriends] = useState(data);

  const updateFriends = async () => {
    try {
      const { data } = await socialApi.post("/friend/addFriends", {
        idUsuario,
      });
      setFriends(data.data);
    } catch (error) {
      setFriends([]);
    }
  };

  return (
    <Box>
      <Container>
        <Text fontSize="4xl">People</Text>
        {friends.map((user) => (
          <People
            key={`id_people_${user.idUsuario}`}
            user={user}
            userReq={idUsuario}
            update={updateFriends}
          />
        ))}
      </Container>
    </Box>
  );
};

Friends.getInitialProps = async (ctx) => {
  try {
    const session = await getSession(ctx);
    const { idUsuario } = session?.user;
    const { data } = await socialApi.post("/friend/addFriends", {
      idUsuario,
    });
    return { data: data?.data, idUsuario };
  } catch (error) {
    return { data: [], idUsuario: 0 };
  }
};

export default Friends;
