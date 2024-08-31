"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Spacer,
  useToast,
  Spinner,
  Center
} from "@chakra-ui/react";
import Image from "next/image";
import passwordIcon from "../../../../public/password-icon.svg";
import { resetPassword, validatePasswordResetToken } from "@/lib/auth";

const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();

  const [validToken, setValidToken] = useState(-1);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    setToken(token);

    const checkToken = async () => {
      if (token) {
        const response = await validatePasswordResetToken(token);
        setValidToken(response.valid);
      } else {
        setValidToken(false);
      }
    };
    checkToken();
  }, []);

  if (validToken === -1) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
    if(validToken == false) {
        return (
            <VStack spacing="4" align="stretch" w="100%" maxW="md" mx="auto" p="8">
                <Text fontSize="2xl" fontWeight="bold" mb="4">
                    {validToken}
                    Invalid or expired token
                </Text>
            </VStack>
        );
    }

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({
            title: "Passwords do not match.",
            status: "error",
            duration: 5000,
            isClosable: true,
            });
            return;
        }
        const { status, message } = await resetPassword({ token, newPassword });
        if (status === "error") {
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }else{
            toast({
                title: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            router.push("/auth");
        }
    };

  return (
    <VStack spacing="4" align="stretch" w="100%" maxW="md" mx="auto" p="8">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Reset Your Password
      </Text>
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
            src={passwordIcon}
            alt="New Password"
            style={{ objectFit: "cover" }}
          />
        </Box>
        <VStack align="start" spacing="1" flex="1">
          <Text fontSize="sm" fontWeight="400">
            New Password
          </Text>
          <InputGroup size="md" w="100%">
            <Input
              name="newPassword"
              fontSize="md"
              fontWeight="bold"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              w="100%"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
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
              alt="Confirm Password"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <VStack align="start" spacing="1" flex="1">
            <Text fontSize="sm" fontWeight="400">
              Confirm Password
            </Text>
            <InputGroup size="md" w="100%">
              <Input
                name="confirmPassword"
                fontSize="md"
                fontWeight="bold"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                w="100%"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </HStack>
      </Flex>
      <Spacer />
      <Button
        colorScheme="purple"
        size="lg"
        w="100%"
        mt="4"
        onClick={handleResetPassword}
      >
        Reset Password
      </Button>
    </VStack>
  );
};

export default ResetPassword;
