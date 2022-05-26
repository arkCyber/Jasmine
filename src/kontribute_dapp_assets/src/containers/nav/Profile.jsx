import React, { useEffect, useState } from "react";
import { Usergeek } from "usergeek-ic-js";
import { AuthClient } from "@dfinity/auth-client";
import IcLogo from "../../../assets/ic-logo.png";
import anvlogo from "../../../assets/anvillogo.svg";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  Tooltip,
  MenuItem,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
  Flex,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { MdPerson } from "react-icons/md";
import { CopyIcon, LockIcon } from "@chakra-ui/icons";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoIosImages } from "react-icons/io";
import { CopyToast } from "../toasts/Toasts";
import { useDispatch, useSelector } from "react-redux";
import {
  useAnvilSelector,
  useAnvilDispatch,
  user_login,
} from "@vvv-interactive/nftanvil-react";
import { e8sToIcp } from "@vvv-interactive/nftanvil-tools/cjs/accountidentifier.js";
import { setLogin, setLogout, setPrincipal } from "../../state/LoginSlice";
import { NavLink } from "react-router-dom";
import SendingIcp from "./SendingIcp";

const Profile = () => {
  const [client, setClient] = useState();
  const dispatch = useDispatch();
  const anvilDispatch = useAnvilDispatch();

  const loggedIn = useSelector((state) => state.Profile.loggedIn);
  const userId = useSelector((state) => state.Profile.principal);
  const address = useAnvilSelector((state) => state.user.address);
  const user_icp = e8sToIcp(useAnvilSelector((state) => state.user.icp));

  const { onCopy } = useClipboard(address);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initAuth = async () => {
    Usergeek.init({
      apiKey: "01B802010D2B6BF49CA5C24532F2D7DB",
    });

    const client = await AuthClient.create();
    const isAuthenticated = await client.isAuthenticated();

    setClient(client);

    if (isAuthenticated) {
      const identity = client.getIdentity();
      const principal = identity.getPrincipal();
      dispatch(setLogin());
      dispatch(setPrincipal(principal.toString()));
      Usergeek.setPrincipal(principal);
      Usergeek.trackSession();
      Usergeek.trackEvent("UserSignIn");
    }
  };

  const signIn = async () => {
    const { identity, principal } = await new Promise((resolve, reject) => {
      client.login({
        identityProvider: "https://identity.ic0.app", //"http://rno2w-sqaaa-aaaaa-aaacq-cai.localhost:8000/",
        onSuccess: () => {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();
          resolve({ identity, principal });
        },
        onError: reject,
      });
    });
    dispatch(setLogin());
    dispatch(setPrincipal(principal.toString()));
    Usergeek.setPrincipal(principal);
    Usergeek.trackSession();
    Usergeek.trackEvent("UserSignIn");
  };

  const signOut = async () => {
    await client.logout();
    dispatch(setLogout());
    dispatch(setPrincipal(""));
    Usergeek.setPrincipal(undefined);
  };

  useEffect(() => {
    initAuth();
    anvilDispatch(user_login());
  }, []);

  return (
    <>
      {loggedIn ? (
        <Menu closeOnSelect={false} autoSelect={false}>
          <MenuButton
            as={Button}
            bg="#17191e"
            border="1px"
            size={useBreakpointValue(["sm", "md"])}
            borderColor="#9d8144"
            color="#f0e6d3"
            colorScheme="#17191e"
          >
            <Flex align="center">
              Profile&nbsp;
              <ChakraImage src={IcLogo} h={"20px"} w={"auto"} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title="User Profile" />
            <Tooltip label="Your unique profile ID">
              <MenuItem icon={<MdPerson />} maxW="240px">
                {userId.substring(0, 10) + "......" + userId.substring(54, 63)}
              </MenuItem>
            </Tooltip>
            <MenuDivider />
            <MenuGroup
              as={"div"}
              title={
                <Flex>
                  ICP Wallet&nbsp;
                  <ChakraImage src={anvlogo} h={"18px"} w={"auto"} />
                </Flex>
              }
            />
            <Tooltip label="Copy address">
              <MenuItem
                closeOnSelect
                onClick={() => {
                  onCopy(), CopyToast();
                }}
                icon={<CopyIcon />}
                maxW="240px"
              >
                {address
                  ? address.substring(0, 10) +
                    "......" +
                    address.substring(56, 64)
                  : null}
              </MenuItem>
            </Tooltip>
            <MenuItem
              icon={<RiSendPlaneFill />}
              command={user_icp}
              closeOnSelect
              onClick={onOpen}
            >
              Transfer ICP
              <SendingIcp
                onClose={onClose}
                isOpen={isOpen}
                user_icp={user_icp}
              />
            </MenuItem>
            <NavLink to="/inventory">
              <MenuItem closeOnSelect icon={<IoIosImages />}>
                NFT Inventory
              </MenuItem>
            </NavLink>
            <MenuDivider />
            <MenuItem icon={<LockIcon />} onClick={() => signOut()}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            bg="#17191e"
            border="1px"
            size={useBreakpointValue(["sm", "md"])}
            borderColor="#9d8144"
            color="#f0e6d3"
            colorScheme="#17191e"
            onClick={() => signIn()}
          >
            <Flex align="center">
              Authenticate&nbsp;
              <ChakraImage src={IcLogo} h={"20px"} w={"auto"} />
            </Flex>
          </MenuButton>
        </Menu>
      )}
    </>
  );
};

export default Profile;
