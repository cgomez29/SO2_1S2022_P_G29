import { getSession } from "next-auth/react";
import {
  Box,
  Image,
  Textarea,
  Container,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { PATH_IMG } from "../constants/constants";
import { DEAFAUL_IMAGE } from "../constants/constants";
import { useRef, useState } from "react";
import { IoImageOutline, IoImageSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import Post from "../components/Post";
import { socialApi } from "../api";

const Dashboard = ({ sesion, data }) => {
  const [user, setUser] = useState(sesion);
  const [image, setImage] = useState("");
  const [posts, setPost] = useState(data);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const toast = useToast();

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const createPost = async () => {
    if (text.length > 0) {
      try {
        let data = await socialApi.post("/post/newPost", {
          idUsuario: user.idUsuario,
          descripcion: text,
          rutaFoto: image,
        });
        toast({
          title: "Account created.",
          position: "top-right",
          description: "Created post",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        updateDashboard();
        setImage("");
        setText("");
      } catch (error) {
        toast({
          title: "Account created.",
          position: "top-right",
          description: "Error creating post",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Account created.",
        position: "top-right",
        description: "you need to write something",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const onClickPhoto = () => {
    inputRef.current?.click();
  };

  const updateDashboard = async () => {
    let data = [];
    try {
      const res = await socialApi.post("/post/getPosts", {
        idUsuario: user?.idUsuario,
      });
      data = res.data.data;
    } catch (error) {}
    setPost(data);
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

  return (
    <>
      <Box mt={6}>
        <Container maxW="container.md" display="flex">
          <Box pr={{ xl: "10px", md: "10px", base: "5px" }}>
            <Image
              borderRadius="full"
              objectFit="cover"
              boxSize={{ xl: "160px", md: "160px", base: "90px" }}
              src={
                user?.image === "" ? DEAFAUL_IMAGE : `${PATH_IMG}${user?.image}`
              }
              alt="picture"
            />
          </Box>
          <Box
            margin="auto"
            width={{
              base: "75%", // 0-48em
              md: "75%", // 48em-80em,
              xl: "75%", // 80em+
            }}
          >
            <Box>
              <Textarea
                size="sm"
                resize={"none"}
                id="text"
                name="text"
                value={text}
                onChange={handleInputChange}
                placeholder={`What are you thinking about, ${user?.name}?`}
              />
            </Box>
          </Box>
          <Box
            margin="auto"
            pl={{ xl: "5px", md: "5px", base: "3px" }}
            onClick={onClickPhoto}
          >
            <motion.div
              whileHover={{
                scale: 1.07,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              {image === "" ? (
                <IoImageOutline size={40} />
              ) : (
                <IoImageSharp size={40} />
              )}
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={onChangePhoto}
                ref={inputRef}
              />
            </motion.div>
          </Box>
        </Container>
        <Container centerContent>
          <Button onClick={createPost}>Publicar</Button>
        </Container>
        <Container pt={6} maxW="container.md">
          {posts.map((post, i) => (
            <Post key={`id_post_${i}`} {...post} />
          ))}
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(ctx) {
  try {
    const session = await getSession(ctx);
    const { idUsuario } = session?.user;
    let data = [];
    try {
      const res = await socialApi.post("/post/getPosts", {
        idUsuario: idUsuario,
      });
      data = res.data.data;
    } catch (error) {}
    return {
      props: {
        sesion: session?.user,
        data: data,
      },
    };
  } catch (error) {
    return {
      props: {
        sesion: {},
        data: [],
      },
    };
  }
}

export default Dashboard;
