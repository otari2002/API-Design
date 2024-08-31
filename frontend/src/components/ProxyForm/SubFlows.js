import { useEffect, useRef, useState } from "react";
import SelectSub from 'react-select';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ButtonGroup,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  useToast,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useTheme } from "@/app/context/ThemeContext";
import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { createBackend, getBackends, getSubFlows } from "@/lib/data";

const SubFlows = ({ flowId = null ,inputs, subflows, setSubFlows, viewOnly=false }) => {
  const { theme } = useTheme();
  const [backends, setBackends] = useState([]);
  const [loadedSubFlows, setLoadedSubFlows] = useState(null);
  const toast = useToast();

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

  const fetchSubFlows = async () => {
    var data = await getSubFlows();
    if (data.status === "error") {
      toast({
        title: "Server is not responding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    data = data.filter(x => x.id !== flowId);
    return data;
  };
  
  const {
    isOpen: openFlowModal,
    onOpen: loadFlowModal,
    onClose: closeFlowModal,
  } = useDisclosure();
  const {
    isOpen: openBackendModal,
    onOpen: loadBackendModal,
    onClose: closeBackendModal,
  } = useDisclosure();
  const {
    isOpen: isOpenInputPicker,
    onOpen: onOpenInputPicker,
    onClose: onCloseInputPicker,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteAlert,
    onOpen: onOpenDeleteAlert,
    onClose: onCloseDeleteAlert,
  } = useDisclosure();
  const [subflowToDelete, setSubflowToDelete] = useState(null);
  const cancelSubflowDelete = useRef();
  const handleCloseDeleteAlert = () => {
    setSubflowToDelete(null);
    onCloseDeleteAlert();
  };
  
  const [currentInputData, setCurrentInputData] = useState(null);

  const handleOpenInputModal = (data, index, subflow, subflowIndex, source) => {
    const filterData = (data) => {
      const filterNode = (key) => {
        const node = data[key];
        if (node.matchedType) {
          return true;
        }
        if (node.isObject && node.children.length > 0) {
          node.children = node.children.filter(filterNode);
          node.isFolder = node.children.length > 0;
          return node.isFolder;
        }
        return false;
      };
    
      const filteredKeys = Object.keys(data).filter(filterNode);
      const filteredData = filteredKeys.reduce((res, key) => {
        res[key] = { ...data[key] };
        if (res[key].children) {
          res[key].children = res[key].children.filter((child) => filteredKeys.includes(child));
          res[key].isFolder = res[key].children.length > 0;
        }
        return res;
      }, {});
    
      return filteredData;
    };
    const filteredData = filterData(data);
    if (Object.keys(filteredData).length === 0) return;
    setCurrentInputData({
      data: filteredData,
      mappingIndex: index,
      subflow: subflow,
      subflowIndex: subflowIndex,
      source: source,
    });
    onOpenInputPicker();
  };

  const [newBackend, setNewBackend] = useState({
    name: "",
    prodUrl: "",
    noProdUrl: "",
    type: "INTERNAL",
  });
  const [selectedFlowId, setSelectedFlowId] = useState("");

  const [subOutputVisibility, setSubOutputVisibility] = useState({});
  const toggleSubOutputVisibility = (id) => {
    setSubOutputVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [mappingVisibility, setMappingVisibility] = useState({});
  const toggleMappingVisibility = (id) => {
    setMappingVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    fetchBackends().then((data) => setBackends(data));
    fetchSubFlows().then((data) => setLoadedSubFlows(data));
  }, []);

  const updateMappingArray = (
    mappings,
    index,
    key,
    value,
    underField = null
  ) => {
    const updatedMappings = [...mappings];
    if (underField) {
      updatedMappings[index][key][underField] = value;
    } else {
      updatedMappings[index][key] = value;
    }
    return updatedMappings;
  };

  const handleSubflowChange = (index, field, value, underField = null) => {
    const updatedSubFlows = [...subflows];
    if (underField) {
      updatedSubFlows[index][field][underField] = value;
    } else {
      updatedSubFlows[index][field] = value;
    }
    setSubFlows(updatedSubFlows);
  };

  const handleLoadFlow = async () => {
    if(loadedSubFlows) loadFlowModal();
  };

  const handleSelectFlow = async () => {
    if (selectedFlowId) {
      let loadedFlow = loadedSubFlows.filter(
        (sf) => sf.id === parseInt(selectedFlowId)
      )[0];
      let newFlow = JSON.parse(JSON.stringify(loadedFlow));
      newFlow.isConditional = false;
      newFlow.isLoaded = true;
      newFlow.requestMappings = {};
      newFlow.subOutputs = {};
      ["BODY", "HEADER", "QUERY"].forEach((source) => {
        newFlow.requestMappings[source] = newFlow.inputs
          .filter((x) => x.source == source)
          .map((input) => ({
            backend: input.name,
            apigee: "",
            source: input.source,
            origin: "",
            subOutputSource: null,
            inputId: input.id,
            type: input.type,
            parentId: input.parentId
          }));
      });
      ["BODY", "HEADER"].forEach((source) => {
        newFlow.subOutputs[source] = loadedFlow.outputs.filter(
          (x) => x.source == source
        ).map((output, index) => ({
          subOutputId: index, ...output
        }));
        newFlow.subOutputs[source].forEach((subOutput) => {
          subOutput.name = subOutput.mapping ? subOutput.mapping : subOutput.name;
        });
      });
      const newFlows = [...subflows, newFlow];
      setSubFlows(newFlows);
      setSelectedFlowId("");
      closeFlowModal();
    }
  };

  const handleRemoveFlow = () => {
    const updatedSubFlows = [...subflows];
    if (subflowToDelete === 0 && updatedSubFlows.length > 1) {
      ["BODY", "HEADER", "QUERY"].forEach((source) => {
        updatedSubFlows[1]?.requestMappings[source].forEach((rm) => {
          if (!["BODY", "HEADER", "QUERY"].includes(rm.origin))
            rm.apigee = "";
        });
      });
    }
    updatedSubFlows.splice(subflowToDelete, 1);
    setSubFlows(updatedSubFlows);
    onCloseDeleteAlert();
  };

  const handleAddBackend = async () => {
    await addBackend(newBackend);
    const newBackendWithId = { ...newBackend, id: backends.length + 1 };
    setBackends([...backends, newBackendWithId]);
    closeBackendModal();
  };

  const renderRequestMapping = (flow, subflowIndex, source) => {
    return flow.requestMappings[source].map((requestMapping) => {
      if (requestMapping.parentId) return <></>;
      const renderChildren = (requestMapping, level = 0) => {
        const index = flow.requestMappings[source].findIndex(
          (rm) => rm.inputId === requestMapping.inputId
        );
        const children = flow.requestMappings[source].filter(
          (child) => child.parentId === requestMapping.inputId
        );
        
        const createCopy = (data) => JSON.parse(JSON.stringify(data));
  
        const transformInputsToTreeItems = (data, parentId = "root") => {
          const items = {};
          data.forEach((item) => {
            const itemId = `${parentId}.${item.name}`;
            const itemChildren = item.children ?? [];
            items[itemId] = {
              index: itemId,
              isFolder: item.type !== "ARRAY" && itemChildren.length > 0,
              children: item.type !== "ARRAY"
                ? itemChildren.map((child) => `${itemId}.${child.name}`)
                : [],
              data: { name: item.name, type: item.type },
              matchedType: requestMapping.type === item.type || !requestMapping.type 
                || source === "HEADER" || source === "QUERY",
              isObject: item.type === "OBJECT",
            };
            if (item.type !== "ARRAY" && item.children && item.children.length > 0) {
              Object.assign(
                items,
                transformInputsToTreeItems(item.children, itemId)
              );
            }
          });
          return items;
        };
  
        const removeArraysChildren = (data) => {
          const idToType = {};
          data.forEach((item) => {
            idToType[item.subOutputId] = item.type;
          });
          const idsToRemove = new Set();
          data.forEach((item) => {
            if (item.parentId !== null && idToType[item.parentId] === "ARRAY") {
              idsToRemove.add(item.subOutputId);
            }
          });
          return data.filter((item) => !idsToRemove.has(item.subOutputId));
        };
  
        const transformOutputsToTreeItems = (outputs) => {
          const items = {};
          const idToItemId = {};
          outputs = removeArraysChildren(outputs);
          outputs.forEach((item) => {
            const itemId = `${
              item.parentId === null ? "root" : idToItemId[item.parentId]
            }.${item.name}`;
            idToItemId[item.id] = itemId;
            items[itemId] = {
              index: itemId,
              isFolder: false,
              children: [],
              data: { name: item.name, type: item.type },
              matchedType: requestMapping.type === item.type || source === "HEADER" || source === "QUERY",
              isObject: item.type === "OBJECT",
            };
            const parentItemId = idToItemId[item.parentId];
            if (parentItemId) {
              items[parentItemId].isFolder = true;
              items[parentItemId].children.push(idToItemId[item.id]);
            }
          });
          Object.keys(items).forEach((key) => {
            if (items[key].type === "OBJECT" && items[key].children.length === 0) {
              items[key].isFolder = false;
            }
          });
          return items;
        };
  
        let availableInputs = {};
        switch (requestMapping.origin) {
          case "BODY":
            let bodyInputsToLoad = createCopy(inputs["BODY"]);
            bodyInputsToLoad.forEach((input) => {
              if (input.type === "ARRAY") input.children = [];
            });
            availableInputs = transformInputsToTreeItems(bodyInputsToLoad);
            break;
          case "HEADER":
            let headerInputsToLoad = createCopy(inputs["HEADER"]);
            availableInputs = transformInputsToTreeItems(headerInputsToLoad);
            break;
          case "QUERY":
            let queryInputsToLoad = createCopy(inputs["QUERY"]);
            availableInputs = transformInputsToTreeItems(queryInputsToLoad);
            break;
          case "":
            break;
          default:
            if (requestMapping.subOutputSource === null) {
              availableInputs = [];
            } else {
              let bodySubOutputs = subflows[requestMapping.origin].subOutputs["BODY"];
              let headerSubOutputs = subflows[requestMapping.origin].subOutputs["HEADER"];
              let subOutputsToLoad =
                requestMapping.subOutputSource === "BODY"
                  ? bodySubOutputs
                  : headerSubOutputs;
              availableInputs = transformOutputsToTreeItems(subOutputsToLoad);
            }
            break;
        }
  
        const hasButton = (source === "BODY" && requestMapping.type === "OBJECT" && children.length > 0);
        const mappingElement = (
          <Flex gap={2} mb={2} ml={level * 4}>
            {hasButton && (
              <Box
                bg={theme.light}
                color="white"
                p={1}
                height={8}
                borderRadius="md"
                _hover={{ bg: theme.strong }}
                onClick={() => toggleMappingVisibility(requestMapping.inputId)}
                cursor="pointer"
                alignContent="center"
                alignSelf="center"
                ml={-3}
              >
                {mappingVisibility[requestMapping.inputId] ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronUpIcon />
                )}
              </Box>
            )}
            <Flex flex="5">
              <Select
                flex="3"
                value={requestMapping.origin || ""}
                ml={hasButton ? 0 : 5}
                onChange={(e) => {
                  handleSubflowChange(
                    subflowIndex,
                    "requestMappings",
                    updateMappingArray(
                      flow.requestMappings[source],
                      index,
                      "origin",
                      e.target.value
                    ),
                    source
                  );
                  handleSubflowChange(
                    subflowIndex,
                    "requestMappings",
                    updateMappingArray(
                      flow.requestMappings[source],
                      index,
                      "apigee",
                      ""
                    ),
                    source
                  );
                }}
                disabled={viewOnly}
                style={{ 
                  opacity: 1, 
                  cursor: 'default'
                }}
              >
                <option value="">Select Origin...</option>
                <option value="BODY">Body Inputs</option>
                <option value="HEADER">Header Inputs</option>
                <option value="QUERY">Query Inputs</option>
                {subflows.slice(0, subflowIndex).map((sf, i) => (
                  <option key={`origin-${i}`} value={i}>
                    Subflow {i + 1}
                  </option>
                ))}
              </Select>
              {!["BODY", "HEADER", "QUERY", ""].includes(requestMapping.origin) && (
                <Select
                  flex="2"
                  ml={2}
                  value={requestMapping.subOutputSource || ""}
                  disabled={viewOnly}
                  style={{ 
                    opacity: 1, 
                    cursor: 'default'
                  }}
                  onChange={(e) => {
                    handleSubflowChange(
                      subflowIndex,
                      "requestMappings",
                      updateMappingArray(
                        flow.requestMappings[source],
                        index,
                        "subOutputSource",
                        e.target.value === "" ? null : e.target.value
                      ),
                      source
                    );
                    handleSubflowChange(
                      subflowIndex,
                      "requestMappings",
                      updateMappingArray(
                        flow.requestMappings[source],
                        index,
                        "apigee",
                        ""
                      ),
                      source
                    );
                  }}
                >
                  <option value="">Select...</option>
                  <option value="BODY">Body</option>
                  <option value="HEADER">Header</option>
                </Select>
              )}
            </Flex>
            <Button
              flex="6"
              onClick={() => {
                if (viewOnly) return;
                handleOpenInputModal(
                  availableInputs,
                  index,
                  flow,
                  subflowIndex,
                  source,
                );
              }}
            >
              {requestMapping.apigee === ""
                ? "Select an input"
                : requestMapping.apigee}
            </Button>
            <Input
              flex="6"
              maxWidth={400}
              type="text"
              placeholder="Mapping"
              value={requestMapping.backend}
              disabled={true}
              sx={{
                "&:disabled": {
                  fontWeight: viewOnly ? "normal" : "bold",
                  opacity: viewOnly ? 1 : 0.5, 
                  cursor: viewOnly ? 'default' : 'not-allowed'
                },
              }}
              onChange={(e) =>
                handleSubflowChange(
                  subflowIndex,
                  "requestMappings",
                  updateMappingArray(
                    flow.requestMappings[source],
                    index,
                    "backend",
                    e.target.value
                  ),
                  source
                )
              }
            />
            <Input
              flex="2"
              maxWidth={200}
              type="text"
              placeholder="Type"
              value={requestMapping.type ? requestMapping.type.charAt(0) +
                requestMapping.type.slice(1).toLowerCase() : ""}
              disabled={true}
              sx={{
                "&:disabled": {
                  fontWeight: viewOnly ? "normal" : "bold",
                  opacity: viewOnly ? 1 : 0.5, 
                  cursor: viewOnly ? 'default' : 'not-allowed'
                },
              }}
            />
          </Flex>
        );
        const childrenElements = requestMapping.type === "OBJECT" && children.length > 0 ?
          children.map((child) => renderChildren(child, level + 1)) : null;
  
        return (
          <Box key={`mapping-${index}`} mb={3}>
            {mappingElement}
            {mappingVisibility[requestMapping.inputId] && (
              <Box ml={4}>
                <Box mt={3} ml={4}>
                  {childrenElements}
                </Box>
              </Box>
            )}
          </Box>
        );
      }
      return renderChildren(requestMapping);
    });
  };
  

  const InputPickerModal = ({ isOpen, onClose, inputData }) => {
    const [selectedInput, setSelectedInput] = useState("");
    const [itemWasSelected, setItemWasSelected] = useState(false);
    const { data, mappingIndex, subflow, subflowIndex, source } = inputData;
    const items = data;
    items["root"] = {
      index: "root",
      isFolder: true,
      children: Object.keys(items).filter((key) => key.split(".").length === 2),
      data: { name: "Root item", type: "" },
    };
    const closeModal = () => {
      if (itemWasSelected) {
        const parentId = subflow.requestMappings[source][mappingIndex].parentId;
        handleSubflowChange(
          subflowIndex,
          "requestMappings",
          updateMappingArray(
            subflow.requestMappings[source],
            mappingIndex,
            "apigee",
            selectedInput
          ),
          source
        );
        if(parentId) {
          const parentIndex = subflow.requestMappings[source].findIndex(mapping => mapping.inputId == parentId);
          handleSubflowChange(
            subflowIndex,
            "requestMappings",
            updateMappingArray(
              subflow.requestMappings[source],
              parentIndex,
              "apigee",
              ""
            ),
            source
          );
        }
        setSelectedInput("");
      }
      setCurrentInputData(null);
      onClose();
    };

    const clearValue = () => {
      handleSubflowChange(
        subflowIndex,
        "requestMappings",
        updateMappingArray(
          subflow.requestMappings[source],
          mappingIndex,
          "apigee",
          ""
        ),
        source
      );
      setCurrentInputData(null);
      onClose();
    };
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an input</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UncontrolledTreeEnvironment
              dataProvider={
                new StaticTreeDataProvider(items, (item, data) => ({
                  ...item,
                  data,
                }))
              }
              getItemTitle={(item) => item.data.name}
              viewState={{}}
              onSelectItems={(item) => {
                if ((items[item[0]].isObject && !items[item[0]].matchedType)
                  || ((source == "HEADER" || source == "QUERY") && items[item[0]].isObject )) {
                  return;
                }
                setItemWasSelected(true);
                setSelectedInput(item[0].split("root.")[1]);
              }}
              renderItemTitle={({ title, item }) => {
                const maxLength = 25;
                const displayTitle =
                  title.length > maxLength
                    ? `${title.slice(0, maxLength)}...`
                    : title;
                return (
                  <Flex
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Text fontSize="large">{displayTitle}</Text>
                    <Text fontSize="medium" ml="auto" color="gray.500">
                      {item.data.type.charAt(0) +
                        item.data.type.slice(1).toLowerCase()}
                    </Text>
                  </Flex>
                );
              }}
            >
              <Tree treeId="tree-1" rootItem="root" treeLabel="inputs" />
            </UncontrolledTreeEnvironment>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green"  mr={3} onClick={clearValue}>
              Clear
            </Button>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const renderSubOutput = (subflow, subflowIndex, subOutput, source) => {
    if (subOutput.parentId) return <></>;
    const renderChildren = (subOutput, level = 0) => {
      const subOutputIndex = subflow.subOutputs[source].findIndex(
        (so) => so.subOutputId === subOutput.subOutputId
      );
      const children = subflow.subOutputs[source].filter(
        (child) => child.parentId === subOutput.id
      );

      const subOutputElement = (
        <Flex
          gap={2}
          mb="2"
          ml={level * 4 + (subOutput.type === "OBJECT" ? 5 : 0)}
          alignItems="center"
        >
          {(subOutput.type === "OBJECT" && children.length > 0)  && (
            <Box
              bg={theme.light}
              color="white"
              p={1}
              borderRadius="md"
              _hover={{ bg: theme.strong }}
              onClick={() => toggleSubOutputVisibility(subOutput.subOutputId)}
              cursor="pointer"
            >
              {subOutputVisibility[subOutput.subOutputId] ? (
                <ChevronDownIcon />
              ) : (
                <ChevronUpIcon />
              )}
            </Box>
          )}
          <Input
            flex="2"
            type="text"
            placeholder="Value"
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
            value={subOutput.name}
            onChange={(e) => {
              handleSubflowChange(
                subflowIndex,
                "subOutputs",
                updateMappingArray(
                  subflow.subOutputs[source],
                  subOutputIndex,
                  "name",
                  e.target.value
                ),
                source
              );
            }}
          />
          <Select
            flex="1"
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
            value={subOutput.type || ""}
            onChange={(e) =>
              handleSubflowChange(
                subflowIndex,
                "subOutputs",
                updateMappingArray(
                  subflow.subOutputs[source],
                  subOutputIndex,
                  "type",
                  e.target.value
                ),
                source
              )
            }
          >
            <option value="">Select Type...</option>
            <option value="STRING">String</option>
            <option value="NUMBER">Number</option>
            <option value="BOOLEAN">Boolean</option>
            {subOutput.source === "BODY" && (
              <>
                <option value="OBJECT">Object</option>
                <option value="ARRAY">Array</option>
              </>
            )}
          </Select>
        </Flex>
      );

      const childrenElements =
        subOutput.type === "OBJECT"
          ? children.map((child) => renderChildren(child, level + 1))
          : null;

      return (
        <Box key={`subOutput-${subOutput.subOutputId}`} ml={childrenElements == null ? 0 : -5} mb={3}>
          {subOutputElement}
          {subOutputVisibility[subOutput.subOutputId] && (
            <Box ml={3}>
              <Box mt={3} ml={10}>
                {childrenElements}
              </Box>
            </Box>
          )}
        </Box>
      );
    };
    return renderChildren(subOutput);
  };

  const SubFlowInfo = ({ subflow, subflowIndex, editSubflow }) => {
    const isElementary = subflow.instanceApigee !== "X" && subflow.instanceApigee !== "HYBRID";
    return (
      <>
      <Flex gap={4} mb={2} className="info-first-row">
        <FormControl flex="2">
          <FormLabel>
            <Text
              fontWeight="bold"
              fontSize="large"
              fontFamily="Arial"
            >
              Subflow {subflowIndex + 1}
            </Text>
          </FormLabel>
          <Input
            type="text"
            value={subflow.name}
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
          />
        </FormControl>
        <FormControl flex="1">
          <Flex direction="column" alignItems="center">
            <FormLabel>Is Conditional</FormLabel>
            <Switch
              isChecked={subflow.isConditional}
              disabled={viewOnly}
              onChange={(e) =>
                editSubflow(
                  subflowIndex,
                  "isConditional",
                  e.target.checked
                )
              }
            />
          </Flex>
        </FormControl>
        <FormControl flex="2">
          {subflow.isConditional && (
            <>
              <FormLabel>Condition</FormLabel>
              <Input
                type="text"
                sx={{
                  "&:disabled": {
                    fontWeight: viewOnly ? "normal" : "bold",
                    opacity: viewOnly ? 1 : 0.5,
                    cursor: viewOnly ? 'default' : 'not-allowed'
                  },
                }}
                value={subflow.condition}
                onChange={(e) =>
                  editSubflow(
                    subflowIndex,
                    "condition",
                    e.target.value
                  )
                }
              />
            </>
          )}
        </FormControl>
      </Flex>
      <Flex gap={4} className="info-second-row">
        <FormControl flex="1">
          <FormLabel>{isElementary ? "Backend": "Domain"}</FormLabel>
          <Input
            type="text"
            value={isElementary ? subflow.backend?.name: subflow.domain ?? ""}
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
          />
        </FormControl>
        <FormControl flex="1">
          <FormLabel>Path</FormLabel>
          <Input
            type="text"
            value={subflow.path}
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
          />
        </FormControl>
        {isElementary && (
          <FormControl flex="1">
          <FormLabel>SSL</FormLabel>
          <Switch
            isChecked={subflow.ssl}
            disabled={true}
            sx={{
              "&:disabled": {
                fontWeight: viewOnly ? "normal" : "bold",
                opacity: viewOnly ? 1 : 0.5,
                cursor: viewOnly ? 'default' : 'not-allowed'
              },
            }}
          />
        </FormControl>
        )}
        
      </Flex>
      </>
    )
  }

  return (
    <AccordionItem>
      <AccordionButton sx={theme.accordion}>
        <Box flex="1" textAlign="left">
          <Text fontWeight="bold" fontFamily="Arial">
            Sub Flows
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <VStack spacing={4} align="stretch" mt={viewOnly ? 2 : 0}>
          {!viewOnly && (
            <Button onClick={handleLoadFlow}>Load Subflow</Button>
          )}
          {loadedSubFlows && (
            <Modal isOpen={openFlowModal} onClose={closeFlowModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select a SubFlow to Load</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                <SubFlowSelect
                  loadedSubFlows={loadedSubFlows}
                  selectedFlowId={selectedFlowId}
                  setSelectedFlowId={setSelectedFlowId}
                />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSelectFlow}>
                  Load
                </Button>
                <Button onClick={closeFlowModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          )}
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
                      setNewBackend({ ...newBackend, prodUrl: e.target.value })
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
                <Button colorScheme="blue" mr={3} onClick={handleAddBackend}>
                  Add Backend
                </Button>
                <Button onClick={closeBackendModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {currentInputData && (
            <InputPickerModal
              isOpen={isOpenInputPicker}
              inputData={currentInputData}
              onClose={onCloseInputPicker}
            />
          )}
          <AlertDialog
            isOpen={isOpenDeleteAlert}
            leastDestructiveRef={cancelSubflowDelete}
            onClose={handleCloseDeleteAlert}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Subflow
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? <br/> You can't undo this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelSubflowDelete} onClick={handleCloseDeleteAlert}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={handleRemoveFlow} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          {subflows.map((flow, subflowIndex) => {
            return (
              <Box
                border="1px"
                borderRadius="md"
                p={4}
                key={`subflow-${subflowIndex}`}
                mb={4}
              >
                <SubFlowInfo 
                  subflow={flow} 
                  subflowIndex={subflowIndex} 
                  editSubflow={handleSubflowChange}
                />
                <VStack align="stretch" mt={4} className="requestVariables">
                  <Text fontWeight="bold" fontFamily="Arial">
                    Request Variables
                  </Text>
                  <Tabs>
                    <TabList>
                      <Tab>Body</Tab>
                      <Tab>Header</Tab>
                      <Tab>Query</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {renderRequestMapping(flow, subflowIndex, "BODY")}
                      </TabPanel>
                      <TabPanel>
                        {renderRequestMapping(flow, subflowIndex, "HEADER")}
                      </TabPanel>
                      <TabPanel>
                        {renderRequestMapping(flow, subflowIndex, "QUERY")}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
                <VStack align="stretch" mt={4} className="responseVariables">
                  <Text fontWeight="bold" fontFamily="Arial">
                    Response Variables
                  </Text>
                  <Tabs>
                    <TabList>
                      <Tab>Body</Tab>
                      <Tab>Header</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {flow.subOutputs["BODY"].map((subOutput) =>
                          renderSubOutput(flow,subflowIndex,subOutput,"BODY")
                        )}
                      </TabPanel>
                      <TabPanel>
                        {flow.subOutputs["HEADER"].map((subOutput) =>
                          renderSubOutput(flow,subflowIndex,subOutput,"HEADER")
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
                <Flex justify="center" align="center" mt={4}>
                {!viewOnly && (
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      setSubflowToDelete(subflowIndex);
                      onOpenDeleteAlert();
                    }}
                  >
                    Remove Subflow
                  </Button>
                )}
                </Flex>     
              </Box>
            );
          })}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

const SubFlowSelect = ({ loadedSubFlows, selectedFlowId, setSelectedFlowId }) => {
  const options = loadedSubFlows.map((subflow) => ({
    value: subflow.id,
    label: subflow.name,
  }));

  const handleChange = (selectedOption) => {
    setSelectedFlowId(selectedOption ? selectedOption.value : "");
  };

  const selectedOption = options.find(option => option.value === selectedFlowId);

  return (
    <SelectSub
      value={selectedOption}
      onChange={handleChange}
      options={options}
      placeholder="Select.."
      isClearable
    />
  );
};
export default SubFlows;