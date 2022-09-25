import React, { useEffect, useState } from "react";
import {
  useAnvilDispatch,
  useAnvilSelector,
  nft_transfer,
  nft_set_price,
} from "@vvv-interactive/nftanvil-react";
import { tokenFromText } from "@vvv-interactive/nftanvil-tools/cjs/token.js";
import * as AccountIdentifier from "@vvv-interactive/nftanvil-tools/cjs/accountidentifier.js";
import { GetMine } from "../components";
import {
  Button,
  Text,
  Container,
  Flex,
  Tooltip,
  useBreakpointValue,
  HStack,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  createStandaloneToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdSell } from "react-icons/md";
import {
  FailedToast,
  SendingToast,
  SuccessICPToast,
  SuccessToast,
} from "../../containers/toasts/Toasts";
import {
  ButtonColorDark,
  ButtonColorLight,
  ButtonTextColorDark,
  ButtonTextColorlight,
} from "../../containers/colormode/Colors";

const { toast } = createStandaloneToast();

const checkSupport = (address) => {
  if (address.toLowerCase().substring(0, 3) !== "a00") return true;
};

// shows if owned on large NFT view
const Owned = ({ tokenId }) => {
  const anvilDispatch = useAnvilDispatch();
  const [loadComponent, setLoadComponent] = useState(false);

  const fetchOwned = async () => {
    const tokens = await anvilDispatch(GetMine());
    
    if (tokens.includes(tokenFromText(tokenId))) {
      setLoadComponent(true);
    } else {
      setLoadComponent(false);
    }
  };

  useEffect(() => {
    fetchOwned();
    const interval = setInterval(() => {
      fetchOwned();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!loadComponent) return null;
  return (
    <Flex bg={"gray.50"} rounded={"lg"}>
      <Container bg={"white"} boxShadow={"xl"} rounded={"lg"} p={4}>
        <Text
          fontWeight={600}
          fontSize={{ base: "md", md: "lg" }}
          color="#b2b8be"
          mb={2}
        >
          Owned
        </Text>
        <HStack>
          <Spacer />
          <SellButton tokenId={tokenId} />
          <TransferButton tokenId={tokenId} />
        </HStack>
      </Container>
    </Flex>
  );
};

const TransferButton = ({ tokenId }) => {
  const address = useAnvilSelector((state) => state.user.address);
  const [To, setTo] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAnvilDispatch();

  const sendNft = async () => {
    let send = { id: tokenId, toAddress: To };

    if (send.toAddress.length !== 64) {
      return FailedToast("Failed", "Invalid ICP address"); // verbose errors for the user
    } else {
      if (checkSupport(send.toAddress))
        return FailedToast("Failed", "Address does not support NFTA");
      onClose();
      SendingToast("Sending NFT...");

      await dispatch(nft_transfer(send));

      toast.closeAll();
      SuccessICPToast(
        tokenId.substring(0, 6) + "..." + tokenId.substring(15, 20),
        To
      );
    }
  };
  const buttonBgColor = useColorModeValue(ButtonColorLight, ButtonColorDark);
  const buttonTextColor = useColorModeValue(
    ButtonTextColorlight,
    ButtonTextColorDark
  );
  return (
    <>
      <Button
        leftIcon={<RiSendPlaneFill />}
        bg={buttonBgColor}
        color={buttonTextColor}
        mt={2}
        size={useBreakpointValue(["md", "lg"])}
        _hover={{ opacity: "0.8" }}
        disabled={address ? false : true}
        onClick={() => onOpen()}
      >
        Transfer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx="10%">
          <ModalHeader>
            <Center>Transfer NFT</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>To Address</FormLabel>
              <Tooltip label="ICP Address (NOT PRINCIPAL ID)">
                <Input
                  variant="filled"
                  placeholder="a00fe60cfcc1ec....."
                  onChange={(event) => setTo(event.target.value)}
                />
              </Tooltip>
              <FormHelperText>
                Address must support NFTA{" "}
                <Tooltip label="popular dapps that support NFTA: kontribute.app and nftanvil.com">
                  <InfoIcon boxSize={5} viewBox="0 0 30 30" />
                </Tooltip>
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<RiSendPlaneFill />}
              bg={buttonBgColor}
              color={buttonTextColor}
              mt={2}
              size={useBreakpointValue(["md", "lg"])}
              _hover={{ opacity: "0.8" }}
              width="100%"
              onClick={() => sendNft()}
            >
              Transfer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SellButton = ({ tokenId }) => {
  const address = useAnvilSelector((state) => state.user.address);
  const [Amount, setAmount] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAnvilDispatch();

  const checkAmount = (amount) => {
    if (Number(amount) < 0 || isNaN(Number(amount))) {
      return false;
    }
    return true;
  };

  const setPrice = async () => {
    if (!checkAmount(Amount)) return FailedToast("Failed", "Invalid amount");
    onClose();

    SendingToast("Setting price...");

    let priceObj = {
      id: tokenId,
      price: {
        amount: AccountIdentifier.icpToE8s(Amount),
        marketplace: [
          {
            address: AccountIdentifier.TextToArray(
              "a00dcee3d64e4daaa34ebfa7b95fba5f095e234d32a4770958e3f8e8818cafe1"
            ),
            share: 50,
          },
        ],
      },
    };

    try {
      await dispatch(nft_set_price(priceObj));
      toast.closeAll();
      SuccessToast(
        "Success",
        `${
          tokenId.substring(0, 6) + "..." + tokenId.substring(15, 20)
        } price set to ${Amount} ICP`
      );
    } catch (e) {
      toast.closeAll();
      FailedToast("Failed", e.toString());
    }
  };

  const buttonBgColor = useColorModeValue(ButtonColorLight, ButtonColorDark);
  const buttonTextColor = useColorModeValue(
    ButtonTextColorlight,
    ButtonTextColorDark
  );
  return (
    <>
      <Button
        leftIcon={<MdSell />}
        bg={buttonBgColor}
        color={buttonTextColor}
        mt={2}
        size={useBreakpointValue(["md", "lg"])}
        _hover={{ opacity: "0.8" }}
        disabled={address ? false : true}
        onClick={() => onOpen()}
      >
        Sell
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx="10%">
          <ModalHeader>
            <Center>Sell NFT</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                variant="filled"
                placeholder="0.1"
                onChange={(event) => setAmount(event.target.value)}
              />
              <FormHelperText>+ 0.05% marketplace fee</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<MdSell />}
              bg={buttonBgColor}
              color={buttonTextColor}
              mt={2}
              size={useBreakpointValue(["md", "lg"])}
              _hover={{ opacity: "0.8" }}
              width="100%"
              onClick={() => setPrice(tokenId)}
            >
              Sell
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Owned;