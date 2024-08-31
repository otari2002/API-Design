import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link
} from '@chakra-ui/react';
import Image from 'next/image';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import apiIcon from "../../public/api-icon.png";
import { logout } from "@/lib/auth";
import { useRouter } from 'next/navigation';

const Links = [{
  name: 'Proxies',
  path: '/proxy'
}, {
  name: 'Flows',
  path: '/flow'
}]

const NavLink = ({children}) => {
  return (
    <Box
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}>
      {children}
    </Box>
  )
}

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} mb={5}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Image
              src={apiIcon}
              alt="api-icon"
              style={{objectFit:"cover"}}
              width={50}
            />
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name}>
                  <Link href={link.path}>{link.name}</Link>
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar size={'sm'} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => {
                  router.push('/profile');
                  }}>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => {
                  logout(); router.push('/auth');
                  }}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
                <NavLink key={link.name}>
                  <Link href={link.path}>{link.name}</Link>
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default Navbar;