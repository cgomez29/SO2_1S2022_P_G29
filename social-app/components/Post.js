import { Box, Button, HStack, Image, Link, Text } from "@chakra-ui/react";
import { DEAFAUL_IMAGE, PATH_IMG } from "../constants/constants";

const Post = ({ name, username, image, post, postImage }) => {
  return (
    <Box mb={8}>
      <Box display="flex" pt={7} pl={7}>
        <Box>
          <Image
            src={image === "" ? DEAFAUL_IMAGE : `${PATH_IMG}${image}`}
            borderRadius="full"
            objectFit="cover"
            boxSize={{ xl: "60px", md: "60px", base: "30px" }}
            alt="picture"
          />
        </Box>
        <Box pt={1} mb="auto" pl={3}>
          <Text fontSize={{ xl: "xl", md: "xl", base: "xs" }}>
            <Link>{name}</Link>
          </Text>
        </Box>
      </Box>
      <Box pl={7} pr={7} pt={7}>
        <Text fontSize={{ xl: "xl", md: "xl", base: "sm" }}>{post}</Text>
      </Box>
      <Box>{postImage === "" ? null : <PostImage postImage={postImage} />}</Box>
      <Box display="flex" pt={7} pb={5}>
        <Box width="30%" m="auto" ml={5}>
          <Button variant="outline" w="100%" size={"sm"}>
            Like
          </Button>
        </Box>
        <Box width="30%" m="auto">
          <Button variant="outline" w="100%" size={"sm"}>
            Commet
          </Button>
        </Box>
        <Box width="30%" m="auto" mr={5}>
          <Button variant="outline" w="100%" size={"sm"}>
            Share
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const PostImage = ({ postImage }) => {
  return (
    <Box p={5}>
      <Image
        src={postImage === "" ? null : `${PATH_IMG}${postImage}`}
        alt="picture"
        m="auto"
      />
    </Box>
  );
};

export default Post;
