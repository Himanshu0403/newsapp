import React, { useContext, useEffect, useState } from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { RiDashboardFill, RiLogoutBoxFill, RiMenu5Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signOut, updateCurrentUser } from 'firebase/auth';
import { auth } from '../firebase';

const LinkButton = ({ url = '/', title = 'Home', onClose }) => (
  <Link onClick={onClose} to={url}>
    <Button variant={'ghost'}>{title}</Button>
  </Link>
);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userStatus, setUserStatus] = useState();

  const { currentUser } = useContext(AuthContext);

  const logoutHandler = () => {
    signOut(auth)
      .then(async () => {
        // Sign-out successful.
        // console.log({ currentUser });
      })
      .catch(error => {
        // An error happened.
      });
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserStatus(true)
      } else setUserStatus(false);
    });
  }, []);
  

  return (
    <>
      <ColorModeSwitcher />
      <Button
        onClick={onOpen}
        colorScheme="yellow"
        width={'12'}
        height={'12'}
        // rounded={'full'}
        zIndex={'overlay'}
        position={'fixed'}
        top={'6'}
        left={'6'}
      >
        <RiMenu5Fill />
      </Button>
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter={'blur'} />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>NEWS APP</DrawerHeader>
          <DrawerBody>
            <VStack spacing={'4'} alignItems={'flex-start'}>
              <LinkButton onClose={onClose} url="/" title="Home" />
              <LinkButton onClose={onClose} url="/contact" title="Contact Us" />
              <LinkButton onClose={onClose} url="/about" title="About" />
              {userStatus===true ? (
                <>
                  <LinkButton
                    onClose={onClose}
                    url="/favourite"
                    title="Favourites"
                  />
                  <HStack
                    justifyContent={'space-evenly'}
                    position={'absolute'}
                    bottom={'2rem'}
                    width={'80%'}
                  >
                    <VStack>
                      <HStack>
                        <Button variant={'ghost'} onClick={logoutHandler}>
                          <RiLogoutBoxFill /> LogOut
                        </Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </>
              ) : (
                <>
                  <Link onClick={onClose} to="/login">
                    <Button colorScheme="yellow">Sign In</Button>
                  </Link>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
