"use client";

import Navbar from "@/components/Navbar";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTheme } from "./context/ThemeContext";

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <>
    <Navbar />
    <Box
      w="100%"
      h="80vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl" color={theme.strong}>
          Welcome to API Manager
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Manage your APIs with ease
        </Text>

        <Flex gap={6}>
          <Button
            backgroundColor={theme.strong}
            color="white"
            size="lg"
            onClick={() => router.push("/proxy")}
          >
            View and Edit Proxies
          </Button>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => router.push("/flow")}
          >
            View and Edit Flows
          </Button>
        </Flex>
      </VStack>
    </Box>
    </>
  );
}
