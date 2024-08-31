"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Center,
  Spinner,
  Heading,
  VStack,
  Text,
  Flex,
  Stack,
  Checkbox,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useTheme } from "@/app/context/ThemeContext";
import Navbar from "@/components/Navbar";
import { getFlows } from "@/lib/data";
import { FaSearch } from "react-icons/fa";

export default function Flows() {
  const { theme } = useTheme();
  const [flows, setSubflows] = useState(null);
  const [includeElementary, setIncludeElementary] = useState(true);
  const [includeApigee, setIncludeApigee] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const subflows = async () => {
      const data = await getFlows();
      if (data.status === "error") {
        toast({
          title: "Server is not responding",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setSubflows(data);
    };
    subflows();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFlows = () => {
    let filteredFlows = flows;
    if (!includeApigee) {
      filteredFlows = filteredFlows.filter((flow) => flow.backendId !== null);
    }
    if (!includeElementary) {
      filteredFlows = filteredFlows.filter((flow) => flow.backendId === null);
    }
    if (searchQuery) {
      filteredFlows = filteredFlows.filter(
        (flow) =>
          flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flow.proxy?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flow.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filteredFlows;
  };

  if (!flows) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Navbar />
      <Box mt={5} px={10}>
        <Flex alignItems="center" mb={5}>
          <Heading size="lg">Flows</Heading>
        </Flex>
        <Stack spacing={5} direction="row" mb={5}>
          <Checkbox
            isChecked={includeApigee}
            onChange={(e) => setIncludeApigee(e.target.checked)}
          >
            Apigee Flows
          </Checkbox>
          <Checkbox
            isChecked={includeElementary}
            onChange={(e) => setIncludeElementary(e.target.checked)}
          >
            Elementary Flows
          </Checkbox>
        </Stack>
        <Box mb={5}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch className="search-icon" />
            </InputLeftElement>
            <Input
              placeholder="Search flows ..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Box>
        <VStack spacing={4}>
          {flows &&
            filteredFlows().map((flow) => (
              <Box
                key={flow.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                width="100%"
              >
                <Flex alignItems="center">
                  <Box flex="1">
                    <Heading
                      fontSize="xl"
                      color={theme.strong}
                      as="a"
                      href={`/flow/${flow.id}`}
                    >
                      {flow.name}
                    </Heading>
                    <Text mt={2} fontWeight="medium">
                      Proxy: {flow.proxy?.name}
                    </Text>
                    {flow.backendId !== null ? (
                      <>
                        <Text mt={2} fontWeight="medium">
                          Backend: {flow.backend.name}
                        </Text>
                        <Text mt={2} fontWeight="medium">
                          {flow.verb} : {flow.path}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text mt={2} fontWeight="medium">
                          Domain: {flow.domain}
                        </Text>
                        <Text mt={2} fontWeight="medium">
                          {flow.verb} : {flow.path}
                        </Text>
                      </>
                    )}
                  </Box>
                </Flex>
              </Box>
            ))}
        </VStack>
      </Box>
    </>
  );
}
