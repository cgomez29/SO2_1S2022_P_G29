import { Box, Container, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { socialApi } from "../../api";
import Notification from "../../components/Notification";

const Notifications = ({ data, idUsuario }) => {
  const [friends, setFriends] = useState(data);

  const updateFriends = async () => {
    try {
      const { data } = await socialApi.post("/friend/getListRequests", {
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
        <Text fontSize="4xl">Notifications</Text>
        {friends.map((user) => (
          <Notification
            key={`id_people_${user.idUsuario}`}
            user={user}
            userId={idUsuario}
            update={updateFriends}
          />
        ))}
      </Container>
    </Box>
  );
};

Notifications.getInitialProps = async (ctx) => {
  try {
    const session = await getSession(ctx);
    const { idUsuario } = session?.user;
    const { data } = await socialApi.post("/friend/getListRequests", {
      idUsuario,
    });

    return { data: data?.data, idUsuario: idUsuario };
  } catch (error) {
    return { data: [], idUsuario: 0 };
  }
};

export default Notifications;
