import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  GridItem,
  SkeletonCircle
} from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import nftdata from "../../../data/nftdata_release.json";
import { tokenUrl } from "@vvv-interactive/nftanvil-tools/cjs/token.js";
import { useAnvilSelector } from "@vvv-interactive/nftanvil-react";
import ViewNft from "../nft_functions/ViewNft";

const GridComponent = ({ name, imgsrc, value }) => {
  const map = useAnvilSelector((state) => state.user.map); //anvil mapper

  const [img, setImg] = useState();
  const [Loaded, setLoaded] = useState(false);

  const load = async () => {
    let src = await tokenUrl(map.space, imgsrc, "thumb");
    setImg(src);
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, [imgsrc]);

  if (name.toLowerCase().match(value.toLowerCase())) {
    return (
      <GridItem>
        <Box
          role={"group"}
          p={4}
          maxW={"330px"}
          w={"full"}
          backgroundColor={"#1e212b"}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
        >
          <Box rounded={"lg"} pos={"relative"}>
            {Loaded ? (
              <ChakraImage
                bg="#fff"
                rounded={"lg"}
                height={["180px", null, "300px"]}
                width={"auto"}
                objectFit={"cover"}
                src={img}
              />
            ) : (
              <SkeletonCircle size={["150", null, "250"]} />
            )}
          </Box>
          <Stack pt={3} align={"start"}>
            <Text
              color={"gray.500"}
              fontSize={{ base: "sm", sm: "xs", md: "md" }}
            >
              Bonsai Warrior
            </Text>
          </Stack>
          <Stack
            pt={2}
            direction={"row"}
            align={"center"}
            justify="space-between"
          >
            <Heading
              fontSize={{ base: "xs", sm: "xs", md: "md" }}
              color={"white"}
            >
              {name}
            </Heading>
            <ViewNft tokenId={imgsrc} />
          </Stack>
        </Box>
      </GridItem>
    );
  } else {
    return null;
  }
};

// not all NFTs have been added
const BonsaiNFT = ({ value }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Center>
        <SimpleGrid columns={[2, null, 4]} pb={5} gap={2} maxW="1250px">
          {nftdata.map((item) => (
            <GridComponent {...item} value={value} key={item.name} /> // value for search
          ))}
        </SimpleGrid>
      </Center>
    </>
  );
};

export default BonsaiNFT;
