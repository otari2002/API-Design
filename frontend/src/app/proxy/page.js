"use client";

import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Center, Heading, Spinner, VStack, Text, Link, Spacer, Textarea, useDisclosure, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Flex,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader
 } from '@chakra-ui/react';
import { useTheme } from '../context/ThemeContext';
import Navbar from "@/components/Navbar";
import { createProxy, deleteProxy, getProxies, updateProxy } from '@/lib/data';

export default function ProxyPage() {
    const [proxies, setProxies] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProxy, setCurrentProxy] = useState(null);
    const { theme } = useTheme();
    const toast = useToast();

    const fetchProxies = async () => {
        const data = await getProxies();
        if(data.status === "error"){
            toast({
                title: "Server is not responding",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        return data;
    };

    const {
        isOpen: openProxyModal,
        onOpen: loadProxyModal,
        onClose: closeProxyModal
    } = useDisclosure();

    const [newProxy, setNewProxy] = useState({
        name: "",
        description: ""
    });

    const {
        isOpen: isOpenDeleteAlert,
        onOpen: onOpenDeleteAlert,
        onClose: onCloseDeleteAlert,
      } = useDisclosure();
    const cancelProxyDelete = useRef();
    const [proxyToDelete, setProxyToDelete] = useState(null);

    const handleCloseDeleteAlert = () => {
        setProxyToDelete(null);
        onCloseDeleteAlert();
    };
    const handleRemoveProxy = async () => {
        const response = await deleteProxy(proxyToDelete);
        toast({
            title: response.message,
            status: response.status,
            duration: 3000,
            isClosable: true,
        });
        if(response.status === "error") return;
        
        setProxies(proxies.filter(proxy => proxy.id !== proxyToDelete));
        onCloseDeleteAlert();
    };

    const addProxy = async () => {
        const response = await createProxy(newProxy);
        if(response.status === "error"){
            toast({
                title: "Server is not responding",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setProxies([...proxies, response.proxy]);
        setNewProxy({
            name: "",
            description: ""
        });
    };

    const editProxy = (proxy) => {
        setCurrentProxy(proxy);
        setNewProxy({
            name: proxy.name,
            description: proxy.description
        });
        setIsEditing(true);
        loadProxyModal();
    };

    const handleUpdateProxy = async () => {
        if(currentProxy.name === newProxy.name && currentProxy.description === newProxy.description){
            toast({
                title: "No changes detected",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            console.log("No changes detected");
            return;
        }
        const response = await updateProxy(currentProxy.id, newProxy);
        if(response.status === "error"){
            toast({
                title: "Server is not responding",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // setProxies(proxies.map(proxy => proxy.id === currentProxy.id ? response.proxy : proxy));
        window.location.reload();
        closeProxyModal();
        setIsEditing(false);
    };

    useEffect(() => {
        let data = fetchProxies();
        data.then(data => setProxies(data));
    }, [setProxies]);

    if (!proxies) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }
 
    return (
    <>
        <Navbar />
        <Box>
            <Head>
                <title>Proxies</title>
            </Head>
            <Box mt={5} px={10}>
                <Center mb={5}>
                    <Heading size="lg">Proxies</Heading>
                    <Spacer />
                    <Button ml={5} color="white" backgroundColor={theme.strong} size="md" onClick={() => {
                        setNewProxy({ name: "", description: "" });
                        setIsEditing(false);
                        loadProxyModal();
                    }}>
                        +
                    </Button>
                </Center>
                <VStack spacing={4} align="stretch">
                    {proxies.length === 0 && (
                        <Text fontSize="20px">No proxies found</Text>
                    )}
                    {proxies.map((proxy) => (
                        <Flex 
                            key={proxy.id} 
                            p={5} 
                            shadow="md" 
                            borderWidth="1px" 
                            borderRadius="md" 
                            align="center"
                        >
                            <Box flex="1">
                                <Heading fontSize="xl">
                                    <Link color={theme.strong} href={`/proxy/${proxy.id}`}>{proxy.name}</Link>
                                </Heading>
                                <Text mt={4}>{proxy.description}</Text>
                            </Box>
                            <Button 
                                backgroundColor={theme.strong}
                                color={"white"}
                                onClick={() => editProxy(proxy)}
                                ml={4}
                            >
                                Edit
                            </Button>
                            <Button 
                                backgroundColor={"red.600"}
                                color={"white"}
                                onClick={() => {
                                    setProxyToDelete(proxy.id);
                                    onOpenDeleteAlert();
                                }}
                                ml={4}
                            >
                                Delete
                            </Button>
                        </Flex>
                    ))}
                </VStack>
                <ProxyModal 
                    proxy={newProxy} 
                    setProxy={setNewProxy} 
                    openProxyModal={openProxyModal} 
                    closeProxyModal={closeProxyModal}
                    handleAddProxy={isEditing ? handleUpdateProxy : addProxy}
                    isEditing={isEditing}
                />
            </Box>
            <AlertDialog
                isOpen={isOpenDeleteAlert}
                leastDestructiveRef={cancelProxyDelete}
                onClose={handleCloseDeleteAlert}
            >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Proxy
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? <br/> 
                  You can't undo this action afterwards. <br/>
                  <strong>It will delete all associated flows as well.</strong>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelProxyDelete} onClick={handleCloseDeleteAlert}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={handleRemoveProxy} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
    </>
    );
}

const ProxyModal = ({ proxy, setProxy, openProxyModal, closeProxyModal, handleAddProxy, isEditing }) => {
    return (
        <Modal isOpen={openProxyModal} onClose={closeProxyModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{isEditing ? "Edit Proxy" : "Add New Proxy"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={proxy.name}
                    onChange={(e) =>
                      setProxy({ ...proxy, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    type="text"
                    value={proxy.description}
                    onChange={(e) =>
                      setProxy({ ...proxy, description: e.target.value })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={()=>{
                    handleAddProxy();
                    closeProxyModal();
                }}>
                  {isEditing ? "Update Proxy" : "Add Proxy"}
                </Button>
                <Button onClick={closeProxyModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
    );
}