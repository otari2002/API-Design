import { useTheme } from "@/app/context/ThemeContext";
import { createBackend, getBackends } from "@/lib/data";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Box,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Text,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  useToast,
} from "@chakra-ui/react";
import styled from "styled-components";

import { useEffect, useState } from "react";
const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
const InfoFlow = ({
  infoflow,
  setInfoflow,
  viewOnly = false,
  viewEditPage = false,
  NumberOfErrors,
  errors,
}) => {
  const toast = useToast();
  
  useEffect(() => {
    const fetchBackends = async () => {
      const data = await getBackends();
      if (data.status === "error") {
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
    fetchBackends().then((data) => {
      setBackends(data);
    });
  }, []);
  const addBackend = async (backendData) => {
    const response = await createBackend(backendData);
    if (response.status === "error") {
      toast({
        title: "Server is not responding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };
  const [newBackend, setNewBackend] = useState({
    name: "",
    prodUrl: "",
    noProdUrl: "",
    type: "INTERNAL",
  });
  const [backends, setBackends] = useState([]);
  const {
    isOpen: openBackendModal,
    onOpen: loadBackendModal,
    onClose: closeBackendModal,
  } = useDisclosure();

  const handleAddBackend = async () => {
    await addBackend(newBackend);
    const newBackendWithId = { ...newBackend, id: backends.length + 1 };
    setBackends([...backends, newBackendWithId]);
    closeBackendModal();
  };

  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value,type,checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setInfoflow((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
    console.log(infoflow);
  };

  const handleSelectBackend = (e) => {
    if (e.target.value == -1) {
      loadBackendModal();
      return;
    }
    console.log("backend ",e.target.value);
    
    handleChange(e);
  };
  return (
    <AccordionItem>
      <AccordionButton sx={theme.accordion}>
        <Box flex="1" textAlign="left">
          <Text fontWeight="bold" fontFamily="Arial">
            Info Flow
            {NumberOfErrors > 0 && (
              <span
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  display: "inline-block",
                  textAlign: "center",
                  minWidth: "20px",
                  height: "20px",
                  lineHeight: "16px",
                  verticalAlign: "middle",
                  marginLeft: "8px",
                }}
              >
                {NumberOfErrors}
              </span>
            )}
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Flex gap={3} flexDirection="column">
          <Flex gap={3}>
            <FormControl flex="2">
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                disabled={viewOnly}
                style={{
                  opacity: 1,
                  cursor: "default",
                  ...(errors?.name && { borderColor: "red" }),
                }}
                type="text"
                id="name"
                name="name"
                value={infoflow.name}
                onChange={handleChange}
                onBlur={handleChange}
              />

              {errors?.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormControl>
            <FormControl flex="2">
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <Input
                disabled={viewOnly}
                style={{
                  opacity: 1,
                  cursor: "default",
                  ...(errors?.subject && { borderColor: "red" }),
                }}
                type="text"
                id="subject"
                name="subject"
                value={infoflow.subject}
                onChange={handleChange}
                onBlur={handleChange}
              />
              {errors?.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
            </FormControl>
            <FormControl flex="2">
              <FormLabel htmlFor="domain">Domain</FormLabel>
              <Input
                disabled={
                  viewOnly ||
                  infoflow.instanceApigee === null ||
                  infoflow.instanceApigee === "NONE"
                }
                style={{
                  opacity: 1,
                  cursor: "default",
                  ...(errors?.domain && { borderColor: "red" }),
                }}
                type="text"
                id="domain"
                name="domain"
                value={infoflow.domain}
                onChange={handleChange}
                onBlur={handleChange}
              />
              {errors?.domain && <ErrorMessage>{errors?.domain}</ErrorMessage>}
            </FormControl>
            <FormControl flex="1">
              <FormLabel htmlFor="instance-apigee">Instance Apigee</FormLabel>
              <Select
                disabled={viewEditPage}
                style={{
                  opacity: 1,
                  cursor: "default",
                }}
                id="instanceApigee"
                name="instanceApigee"
                value={infoflow.instanceApigee}
                onChange={handleChange}
              >
                <option value="NONE">Select..</option>
                <option value="X">X</option>
                <option value="HYBRID">HYBRID</option>
              </Select>
            </FormControl>
          </Flex>
          <Flex gap={3}>
            <Flex gap={2} flexDirection="column" flex="1">
              <FormControl>
                <FormLabel htmlFor="path">Path</FormLabel>
                <Input
                  disabled={viewOnly}
                  style={{
                    opacity: 1,
                    cursor: "default",
                    ...(errors?.path && { borderColor: "red" }),
                  }}
                  type="text"
                  id="path"
                  name="path"
                  value={infoflow.path}
                  onChange={handleChange}
                  onBlur={handleChange}
                />
                {errors?.path && <ErrorMessage>{errors?.path}</ErrorMessage>}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="verb">Verb</FormLabel>
                <Select
                  disabled={viewOnly}
                  style={{
                    opacity: 1,
                    cursor: "default",
                  }}
                  id="verb"
                  name="verb"
                  value={infoflow.verb}
                  onChange={handleChange}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PUT">PUT</option>
                </Select>
              </FormControl>
            </Flex>
            <FormControl flex="2">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                disabled={viewOnly}
                style={{
                  opacity: 1,
                }}
                id="description"
                name="description"
                value={infoflow.description}
                onChange={handleChange}
                onBlur={handleChange}
                maxLength="250"
              />
            </FormControl>

            <FormControl flex="2">
              <FormLabel htmlFor="">Backend</FormLabel>

              <Select
                id="backend"
                name="backendId"
                value={infoflow.backendId ?? ""}
                disabled={
                  viewOnly ||
                  (infoflow.instanceApigee !== null &&
                    infoflow.instanceApigee !== "NONE")
                }
                onChange={handleSelectBackend}
                sx={{
                  "&:disabled": {
                    fontWeight: "bold",
                  },
                }}
              >
                <option value="">Select Backend...</option>
                {backends.map((backend) => (
                  <option key={backend.id} value={backend.id}>
                    {backend.name}
                  </option>
                ))}
                <option value={-1}>Add New Backend...</option>
              </Select>
              {errors?.backendId && <ErrorMessage>{errors?.backendId}</ErrorMessage>}

              <Modal isOpen={openBackendModal} onClose={closeBackendModal}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add New Backend</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl>
                      <FormLabel>Backend Name</FormLabel>
                      <Input
                        type="text"
                        value={newBackend.name}
                        onChange={(e) =>
                          setNewBackend({ ...newBackend, name: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Production URL</FormLabel>
                      <Input
                        type="text"
                        value={newBackend.prodUrl}
                        onChange={(e) =>
                          setNewBackend({
                            ...newBackend,
                            prodUrl: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>No Production URL</FormLabel>
                      <Input
                        type="text"
                        value={newBackend.noProdUrl}
                        onChange={(e) =>
                          setNewBackend({
                            ...newBackend,
                            noProdUrl: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={newBackend.type || ""}
                        onChange={(e) =>
                          setNewBackend({ ...newBackend, type: e.target.value })
                        }
                      >
                        <option value="INTERNAL">Internal</option>
                        <option value="EXTERNAL">External</option>
                      </Select>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={handleAddBackend}
                    >
                      Add Backend
                    </Button>
                    <Button onClick={closeBackendModal}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </FormControl>

            <FormControl flex="1">
              <FormLabel>SSL</FormLabel>
              <Switch
                id="ssl"
                name="ssl"
                isChecked={infoflow.ssl}
                onChange={handleChange}
                disabled={viewOnly || infoflow.instanceApigee !== "NONE"}
              />
            </FormControl>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default InfoFlow;