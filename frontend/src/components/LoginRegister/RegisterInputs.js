import React from "react";
import {
  Flex,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  HStack,
  Box
} from "@chakra-ui/react";

import Image from 'next/image';
import emailIcon from "../../../public/email-icon.svg";
import passwordIcon from "../../../public/password-icon.svg";
import passwordConfirmIcon from "../../../public/password-confirmation.svg";

const RegisterInputs = ({ showPassword, handleClick, showPasswordConfirmation, handleClickConfirmation, validationErrors }) => {
  return (
    <>
      <VStack align="start" spacing="4" w="100%">
      <Flex
        bg="gray.200"
        borderRadius="md"
        p="2"
        align="center"
        w="100%"
        gap="4"
      >
        <Box ml="2">
        <Image
          src={emailIcon}
          alt="Email"
          style={{objectFit:"cover"}}
        />
        </Box>
        <VStack align="start" spacing="1" flex="1">
          <Text fontSize="sm" fontWeight="400">
            Email
          </Text>
          <Input
            name="email"
            fontSize="md"
            fontWeight="bold"
            type="text"
            placeholder="Enter Email"
            w="100%"
          />
          <Text fontSize="sm" color="red.500">{validationErrors.email}</Text>
        </VStack>
      </Flex>
      <Flex
        bg="gray.200"
        borderRadius="md"
        p="2"
        align="center"
        w="100%"
        justify="space-between"
        gap="4"
      >
        <HStack spacing="4" flex="1">
          <Box ml="2">
          <Image
            src={passwordIcon}
            alt="password-icon"
            style={{objectFit:"cover"}}
          />
          </Box>
          <VStack align="start" spacing="1" flex="1">
            <Text fontSize="sm" fontWeight="400">
              Password
            </Text>
            <InputGroup size="md" w="100%">
              <Input
                name="password"
                fontSize="md"
                fontWeight="bold"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                w="100%"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Text fontSize="sm" color="red.500">{validationErrors.password}</Text>
          </VStack>
        </HStack>
      </Flex>
      <Flex
        bg="gray.200"
        borderRadius="md"
        p="2"
        align="center"
        w="100%"
        justify="space-between"
        gap="4"
      >
        <HStack spacing="4" flex="1">
          <Box ml="2">
          <Image
            src={passwordConfirmIcon}
            alt="password-confirmation-icon"
            style={{objectFit:"cover"}}
          />
          </Box>
          <VStack align="start" spacing="1" flex="1">
            <Text fontSize="sm" fontWeight="400">
              Confirm Password
            </Text>
            <InputGroup size="md" w="100%">
              <Input
                name="password_confirmation"
                fontSize="md"
                fontWeight="bold"
                type={showPasswordConfirmation ? 'text' : 'password'}
                placeholder="Confirm password"
                w="100%"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClickConfirmation}>
                  {showPasswordConfirmation ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </HStack>
      </Flex>
      </VStack>
    </>
  );
};

export default RegisterInputs;
