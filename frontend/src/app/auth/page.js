"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Link,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import Image from 'next/image';
import apiIcon from "../../../public/api-icon.png";
import LoginInputs from "@/components/LoginRegister/LoginInputs";
import RegisterInputs from "@/components/LoginRegister/RegisterInputs";
import { useRouter } from "next/navigation";
import { getSession, login, register } from "@/lib/auth";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/definitions";

export default function AuthPage() {
  const router = useRouter();
  const toast = useToast();
  const [session, setSession] = useState(-1);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const handleClickConfirmation = () => setShowPasswordConfirmation(!showPasswordConfirmation);
  const [rememberUser, setRememberUser] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const loadSession = async () => {
    const result = await getSession();
    setSession(result);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const formData = new FormData(e.target);
    if(showRegister) {
      const validationResult = RegisterFormSchema.safeParse({ email: formData.get("email"), password: formData.get("password")});
      if(!validationResult.success) {
        const errorMessages = {};
        validationResult.error.errors.forEach((err) => {
          errorMessages[err.path[0]] = err.message;
        });
        setValidationErrors(errorMessages);
        return;
      }
      if(formData.get("password") !== formData.get("password_confirmation")) {
        alert("Passwords do not match");
        return;
      }
      const registerResponse = await register(formData);
      if(registerResponse.status === "error") {
        toast({
          title: registerResponse.message,
          position: 'bottom-right',
          status: 'error',
          isClosable: true,
          duration: 3000
        })
      }else{
        toast({
          title: registerResponse.message,
          position: 'bottom-right',
          status: 'success',
          isClosable: true,
          duration: 3000
        })
        setValidationErrors({});
        setShowRegister(false);
      }
    }else{
      const validationResult = LoginFormSchema.safeParse({ email: formData.get("email") });
      if(!validationResult.success) {
        const errorMessages = {};
        validationResult.error.errors.forEach((err) => {
          errorMessages[err.path[0]] = err.message;
        });
        setValidationErrors(errorMessages);
        return;
      }
      const { ok, message } = await login(formData, rememberUser);
      if(!ok){
        toast({
          title: message,
          position: 'bottom-right',
          status: 'error',
          isClosable: true,
          duration: 3000
        })
      }else{
        toast({
          title: message,
          position: 'bottom-right',
          status: 'success',
          isClosable: true,
          duration: 2000
        })
        router.push("/");
      }
    }
  };

  const LoginRegisterForm = () => {
    return (
    <VStack
      spacing="4"
      w={{ base: "100%", md: "67%" }}
      align="start"
      justify="center"
      as="form"
      onSubmit={handleSubmit}
    >
      <Text fontSize="2xl" fontWeight="medium" color="gray.800">
        API Manager
      </Text>
      {showRegister ? (
        <RegisterInputs
          showPassword={showPassword}
          handleClick={handleClick}
          showPasswordConfirmation={showPasswordConfirmation}
          handleClickConfirmation={handleClickConfirmation}
          validationErrors={validationErrors}
        />
      ) : (
        <LoginInputs
          showPassword={showPassword}
          handleClick={handleClick}
          rememberUser={rememberUser}
          setRememberUser={setRememberUser}
          validationErrors={validationErrors}
        />
      )}
      <Button
        colorScheme="purple"
        size="md"
        w="full"
        mt="4"
        fontWeight="600"
        type="submit"
      >
        {showRegister ? "Register" : "Login"}
      </Button>
      {showRegister ?
        <Text>
          Already have an account? {" "}
          <Link
            fontSize="md"
            color="purple.600"
            onClick={() => {
              setValidationErrors({});
              setShowRegister(false);
            }}
          >
            Login
          </Link>
        </Text>
        :
        <Text>
          Don{"’"}t have an account? {" "}
          <Link
            fontSize="md"
            color="purple.600"
            onClick={() => {
              setValidationErrors({});
              setShowRegister(true);
            }}
          >
            Register
          </Link>
        </Text>
      }
    </VStack>
    );
  };

  if(session == -1){
    return (
      <Center h="100vh">
        <Spinner size="xl"/>
      </Center>
    )
  }

  return (
    <Box
      borderRadius="md"
      p={{ base: "16", md: "20" }}
      maxW="1100px"
      mx="auto"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: "10", md: "20" }}
      >
      <VStack
        w={{ base: "100%", md: "33%" }}
        mt={{ base: "0", md: "20" }}
        maxW="400px"
        alignItems="center"
      >
        <Image
          src={apiIcon}
          alt="api-icon"
          style={{objectFit:"cover"}}
        />
      </VStack>
      {session ? (
        <Center>
          <VStack spacing="4">
            <Text fontSize="2xl" fontWeight="medium" color="gray.800">
              You are already logged in
            </Text>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </VStack>
        </Center>
      ) : 
        <LoginRegisterForm />
      }
      
      </Flex>
    </Box>
  );
}

