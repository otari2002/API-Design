"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Center, Spinner, Heading, VStack, Text, Button, Flex, Spacer, useToast } from '@chakra-ui/react';
import { useTheme } from '@/app/context/ThemeContext';
import Navbar from "@/components/Navbar";
import { getProxy } from '@/lib/data';

export default function ProxyDetail({ params }) {
    const { theme } = useTheme();
    const toast = useToast();
    const proxyId = parseInt(params.slug);
    if (proxyId.toString() !== params.slug || isNaN(proxyId)) return notFound();
    const [flows, setFlows] = useState(null);
    const [proxy, setProxy] = useState(null);
    const [unknownProxy, setUnknownProxy] = useState(false);
    
    useEffect(() => {
        const fetchFlows = async () => {
            const data = await getProxy(proxyId);
            if(data.status === "error"){
                toast({
                    title: "Server is not responding",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            if(data?.proxy == null){
                setUnknownProxy(true);
                return;
            }
            setFlows(data.flows);
            setProxy(data.proxy);
        };
        fetchFlows();
    }, [proxyId]);

    if(unknownProxy) return notFound();

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
            <Flex justifyContent="center" alignItems="center" mb={5}>
                <Heading size="lg">{proxy.name}</Heading>
                <Spacer />
                <Link href={`/proxy/${proxyId}/add`} passHref>
                    <Button ml={5} color="white" backgroundColor={theme.strong} size="md">
                        +
                    </Button>
                </Link>
            </Flex>
            <VStack spacing={4}>
                {flows.length === 0 && (
                    <Text fontSize="20px">No flows found</Text>
                )}
                {flows.map((flow) => (
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
                            <Heading fontSize="xl" color={theme.strong}
                                as="a" href={`/flow/${flow.id}`}>
                                    {flow.name}
                            </Heading>
                            <Text mt={1} fontWeight="medium">Subject: {flow.subject}</Text>
                            {flow.backendId !== null ? (<>
                                <Text mt={2} fontWeight="medium">Backend: {flow.backend.name}</Text>
                                <Text mt={2} fontWeight="medium">{flow.verb} : {flow.path}</Text>   
                            </>) : (<>
                                <Text mt={2} fontWeight="medium">Domain: {flow.domain}</Text>
                                <Text mt={2} fontWeight="medium">{flow.verb} : {flow.path}</Text>
                            </>)}
                        </Box>  
                    </Flex>
                </Box>
                ))}
            </VStack>
        </Box>
    </>
    );
}
