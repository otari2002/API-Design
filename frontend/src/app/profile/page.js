"use client";

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Center,
  Spinner,
  useToast,
  InputGroup,
  InputRightElement,
  Text
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "@/components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { editPassword } from "@/lib/auth";
import { EditPasswordFormSchema } from "@/lib/definitions";

const Profile = () => {
  const { user, fetchUser } = useContext(UserContext);
  const theme = useTheme();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [validationError, setValidationError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);

  useEffect(() => {
    if(user === -1) fetchUser();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const validationResult = EditPasswordFormSchema.safeParse({ password: formData.get("password") });
    if(!validationResult.success) {
      setValidationError(validationResult.error.errors[0].message);
      return;
    }
    setLoading(true);

    const response = await editPassword(formData);

    setLoading(false);
    toast({
      title: response.message,
      position: 'bottom-right',
      status: response.status,
      isClosable: true,
      duration: 3000
    })
  };

  return (
    <>
    <Navbar />
    {user === -1 ? (
        <Center height="100vh">
            <Spinner size="xl" />
        </Center>
    ) : (
      <Box maxW="md" mx="auto" mt="8" p="6" borderWidth="1px" borderRadius="lg" as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="lg" mb="6" textAlign="center">
        User Details
        </Heading>

        <FormControl mb="4" isReadOnly>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={user?.email} readOnly />
        </FormControl>

        <FormControl mb="4">
            <FormLabel>Current Password</FormLabel>
            <InputGroup size="md" w="100%">
              <Input
                name="currentPassword"
                placeholder="Enter current password"
                type={showCurrentPassword ? 'text' : 'password'}
              />  
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={toggleCurrentPassword}>
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl mb="4">
            <FormLabel>New Password</FormLabel>
            <InputGroup size="md" w="100%">
              <Input
                name="password"
                placeholder="Enter new password"
                type={showPassword ? 'text' : 'password'}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={togglePassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Text fontSize="sm" color="red.500">{validationError}</Text>
        </FormControl>

        <Button
            backgroundColor={theme.strong}
            type="submit"
            isLoading={loading}
            loadingText="Updating"
        >
        Update Password
        </Button>
    </Box>
    )}
    </>
  );
};

export default Profile;
