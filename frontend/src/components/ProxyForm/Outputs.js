import {
  Box,
  Button,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment,
} from "react-complex-tree";
import { DeleteIcon } from "@chakra-ui/icons";
import { useTheme } from "@/app/context/ThemeContext";
import { useState } from "react";
import styled from "styled-components";

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
const Outputs = ({
  inputs,
  outputs,
  subflows,
  setOutputs,
  viewOnly = false,
  outputsErrors,
  NumberOfOutputsErrors,
}) => {
  console.log("OutputsErrors: ", outputsErrors);

  const { theme } = useTheme();
  const {
    isOpen: isOpenInputPicker,
    onOpen: onOpenInputPicker,
    onClose: onCloseInputPicker,
  } = useDisclosure();
  const [currentInputData, setCurrentInputData] = useState(null);
  const handleOpenInputModal = (data, source, index) => {
    if (Object.keys(data).length === 0) return;
    setCurrentInputData({
      data: data,
      source: source,
      index: index,
    });
    onOpenInputPicker();
  };

  const handleOutputChange = (source, index, value, key) => {
    const updatedOutputs = { ...outputs };
    let current = updatedOutputs[source];
    current[index][key] = value;
    setOutputs(updatedOutputs);
  };

  const handleAddOutputZone = (source) => {
    setOutputs({
      ...outputs,
      [source]: [
        ...outputs[source],
        {
          name: "",
          validation: "",
          source,
          mapping: "",
          origin: "",
          subOutputSource: null,
        },
      ],
    });
  };

  const handleRemoveOutputZone = (source, index) => {
    const updatedOutputs = { ...outputs };
    updatedOutputs[source] = updatedOutputs[source].filter(
      (_, i) => i !== index
    );
    setOutputs(updatedOutputs);
  };

  const InputPickerModal = ({ isOpen, onClose, inputData }) => {
    const [selectedInput, setSelectedInput] = useState({});
    const [itemWasSelected, setItemWasSelected] = useState(false);
    const { data, source, index } = inputData;
    const items = data;
    items["root"] = {
      index: "root",
      isFolder: true,
      children: Object.keys(items).filter((key) => key.split(".").length === 2),
      data: { name: "Root item", type: "" },
    };
    const closeModal = () => {
      if (itemWasSelected) {
        handleOutputChange(source, index, selectedInput.name, "name");
        handleOutputChange(source, index, selectedInput.type, "type");
        setSelectedInput({});
      }
      setCurrentInputData(null);
      onClose();
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
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
                setItemWasSelected(true);
                setSelectedInput(
                  { 
                    name: item[0].split("root.")[1],
                    type : items[item[0]].data.type
                  });
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
                      {item.data.type?.charAt(0) +
                        item.data.type?.slice(1).toLowerCase()}
                    </Text>
                  </Flex>
                );
              }}
            >
              <Tree treeId="tree-1" rootItem="root" treeLabel="inputs" />
            </UncontrolledTreeEnvironment>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const renderOutputs = (source, output, index) => {
    console.log("Source: ", source);
    console.log("Index: ", index);

    const transformInputsToTreeItems = (data, parentId = "root") => {
      const items = {};
      data.forEach((item) => {
        const itemId = `${parentId}.${item.name}`;
        items[itemId] = {
          index: itemId,
          isFolder:
            item.type != "ARRAY" && item.children && item.children.length > 0,
          children:
            item.type != "ARRAY" && item.children
              ? item.children.map((child) => `${itemId}.${child.name}`)
              : [],
          data: { name: item.name, type: item.type },
        };
        if (item.type != "ARRAY" && item.children && item.children.length > 0) {
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
        idToType[item.id] = item.type;
      });
      const idsToRemove = new Set();
      data.forEach((item) => {
        if (item.parentId !== null && idToType[item.parentId] === "ARRAY") {
          idsToRemove.add(item.id);
        }
      });
      return data.filter((item) => !idsToRemove.has(item.id));
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
        };
        const parentItemId = idToItemId[item.parentId];
        if (parentItemId) {
          items[parentItemId].isFolder = true;
          items[parentItemId].children.push(idToItemId[item.id]);
        }
      });
      Object.keys(items).forEach((key) => {
        if (items[key].type === "OBJECT" && items[key].children.length == 0) {
          items[key].isFolder = false;
        }
      });
      return items;
    };

    let availableOutputs = {};
    switch (output.origin) {
      case "BODY":
        let bodyInputsToLoad = [];
        if (source != "BODY") {
          bodyInputsToLoad = inputs["BODY"].filter(
            (input) => input.type !== "OBJECT" && input.type !== "ARRAY"
          );
        } else {
          bodyInputsToLoad = inputs["BODY"];
        }
        bodyInputsToLoad.forEach((input) => {
          if (input.type === "ARRAY") input.children = [];
        });
        availableOutputs = transformInputsToTreeItems(bodyInputsToLoad);
        break;
      case "HEADER":
        availableOutputs = transformInputsToTreeItems(inputs["HEADER"]);
        break;
      case "QUERY":
        availableOutputs = transformInputsToTreeItems(inputs["QUERY"]);
        break;
      case "":
        break;
      default:
        if (output.subOutputSource === null) {
          availableOutputs = [];
        } else {
          let bodySubOutputs = subflows[output.origin]
            ? subflows[output.origin].subOutputs["BODY"]
            : [];
          if (source != "BODY") {
            bodySubOutputs = bodySubOutputs.filter(
              (output) =>
                output.type !== "OBJECT" &&
                output.type !== "ARRAY" &&
                output.parentId === null
            );
          }
          let headerSubOutputs = subflows[output.origin]
            ? subflows[output.origin].subOutputs["HEADER"]
            : [];
          headerSubOutputs.forEach((output) => {
            output.index += bodySubOutputs.length;
          });
          let subOutputsToLoad =
            output.subOutputSource === "BODY"
              ? bodySubOutputs
              : headerSubOutputs;
          availableOutputs = transformOutputsToTreeItems(subOutputsToLoad);
        }
        break;
    }

    return (
      <Flex key={index} gap={2} mb={2}>
        <Select
          flex="1"
          disabled={viewOnly}
          sx={{
            "&:disabled": {
              opacity: 1,
              cursor: "default",
            },
          }}
          value={output.origin ?? ""}
          onChange={(e) => {
            handleOutputChange(source, index, e.target.value, "origin");
            handleOutputChange(source, index, "", "name");
          }}
        >
          <option value="">Select Origin...</option>
          <option value="BODY">Body Inputs</option>
          <option value="HEADER">Header Inputs</option>
          <option value="QUERY">Query Inputs</option>
          {subflows.map((sf, i) => (
            <option key={`subflow-${i}`} value={i}>
              Subflow {i + 1}
            </option>
          ))}
        </Select>

        {!["BODY", "HEADER", "QUERY", ""].includes(output.origin) && (
          <Select
            flex="1"
            disabled={viewOnly}
            sx={{
              "&:disabled": {
                opacity: 1,
                cursor: "default",
              },
            }}
            value={output.subOutputSource ?? ""}
            onChange={(e) => {
              handleOutputChange(
                source,
                index,
                e.target.value == "" ? null : e.target.value,
                "subOutputSource"
              );
              handleOutputChange(source, index, "", "name");
            }}
          >
            <option value="">Select...</option>
            <option value="BODY">Body</option>
            <option value="HEADER">Header</option>
          </Select>
        )}
        <Box flex="2">
          <Button
            w="100%"
            onClick={() => {
              if (viewOnly) return;
              handleOpenInputModal(availableOutputs, source, index);
            }}
          >
            {output.name == "" ? "Select an output" : output.name}
          </Button>
          {Object.keys(outputsErrors)
            .filter((key) => key === `${source}.${index}.name`)
            .map((key) => (
              <ErrorMessage key={key}>{outputsErrors[key]}</ErrorMessage>
            ))}
        </Box>

        <Box>
          <Input
            flex="2"
            disabled={viewOnly}
            sx={{
              "&:disabled": {
                opacity: 1,
                cursor: "default",
              },
            }}
            type="text"
            placeholder="Mapping"
            value={output.mapping}
            onChange={(e) =>
              handleOutputChange(source, index, e.target.value, "mapping")
            }
          />
          {Object.keys(outputsErrors)
            .filter((key) => key === `${source}.${index}.mapping`)
            .map((key) => (
              <ErrorMessage key={key}>{outputsErrors[key]}</ErrorMessage>
            ))}
        </Box>

        {!viewOnly && !output.loadedValue && (
          <Button
            colorScheme="red"
            onClick={() => handleRemoveOutputZone(source, index)}
          >
            <DeleteIcon />
          </Button>
        )}
      </Flex>
    );
  };

  return (
    <AccordionItem>
      <AccordionButton sx={theme.accordion}>
        <Box flex="1" textAlign="left">
          <Text fontWeight="bold" fontFamily="Arial">
            Outputs
            {NumberOfOutputsErrors > 0 && (
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
                {NumberOfOutputsErrors}
              </span>
            )}
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        {currentInputData && (
          <InputPickerModal
            isOpen={isOpenInputPicker}
            inputData={currentInputData}
            onClose={onCloseInputPicker}
          />
        )}
        <Tabs>
          <TabList>
            <Tab>Body</Tab>
            <Tab>Header</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {outputs["BODY"].map((output, index) =>
                renderOutputs("BODY", output, index)
              )}
              {!viewOnly && (
                <Button
                  color="white"
                  backgroundColor={theme.strong}
                  onClick={() => handleAddOutputZone("BODY")}
                >
                  Add Body Output
                </Button>
              )}
            </TabPanel>
            <TabPanel>
              {outputs["HEADER"].map((output, index) =>
                renderOutputs("HEADER", output, index)
              )}
              {!viewOnly && (
                <Button
                  color="white"
                  backgroundColor={theme.strong}
                  onClick={() => handleAddOutputZone("HEADER")}
                >
                  Add Header Output
                </Button>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default Outputs;
