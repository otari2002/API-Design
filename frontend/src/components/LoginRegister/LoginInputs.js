import React, { useState } from "react";
import {
  Flex,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  Box,
  Checkbox,
  Spacer,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from 'next/image';
import emailIcon from "../../../public/email-icon.svg";
import passwordIcon from "../../../public/password-icon.svg";
import { requestPasswordReset } from "@/lib/auth";
import { ResetPasswordFormSchema } from "@/lib/definitions";

const LoginInputs = ({ showPassword, handleClick, rememberUser, setRememberUser, validationErrors }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [emailToReset, setEmailToReset] = useState("");
  const closeModal = () => {
    setEmailToReset("");
    onClose();
  };
  const [validationError, setValidationError] = useState("");
  const handlePasswordReset = async () => {
    const validationResult = ResetPasswordFormSchema.safeParse({ email: emailToReset });
    if(!validationResult.success) {
      setValidationError(validationResult.error.errors[0].message);
      return;
    }
    const response = await requestPasswordReset(emailToReset);
    toast({
      title: response.message,
      status: response.status,
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
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
            style={{ objectFit: "cover" }}
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
              style={{ objectFit: "cover" }}
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
          </VStack>
        </HStack>
      </Flex>
      <Flex flexDir="row" w="100%">
        <HStack spacing="3" flex="1">
          <Checkbox 
            colorScheme="purple" 
            isChecked={rememberUser}
            onChange={(e) => setRememberUser(e.target.checked)}
          />
          <Text fontSize="md">Remember me</Text>
        </HStack>
        <Spacer />
        <HStack spacing="3" justify="flex-end">
          <Link
            fontSize="md"
            color="purple.600"
            onClick={()=> {
              setValidationError("");
              onOpen();
            }}
          >
            Forgot Password ?
          </Link>
        </HStack>
      </Flex>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Please enter your email to reset your password.</Text>
            <Input
              mt="4"
              placeholder="Enter your email"
              value={emailToReset}
              onChange={(e) => setEmailToReset(e.target.value)}
            />
            <Text fontSize="sm" color="red.500">{validationError}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={() => handlePasswordReset()}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginInputs;
