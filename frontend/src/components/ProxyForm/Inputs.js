import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Flex,
  Text,
  RadioGroup,
  Radio,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";

import styled from "styled-components";
const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
const InputsView = ({
  inputs,
  setInputs,
  viewOnly = false,
  subFlowOutputs = false,
  inputsErrors,
  NumberOfInputsErrors,
}) => {

  const [visiblePaths, setVisiblePaths] = useState({});
  const [selectedBodyInputType, setSelectedBodyInputType] = useState("form");
  const { theme } = useTheme();
  const [inputsNumber, setInputsNumber] = useState({
    BODY: inputs["BODY"].length,
    HEADER: inputs["HEADER"].length,
    QUERY: inputs["QUERY"]?.length ?? 0,
  });

  const changeInputsNumber = (source, val) => {
    const updatedInputs = { ...inputs };
    const currentLength = updatedInputs[source].length;
    const number = val == "" ? 0 : parseInt(String(val).replace(/\D/, ""));

    if (currentLength > number) {
      let i = 0;
      while (
        i < currentLength - number &&
        updatedInputs[source].at(-1)?.name == "" &&
        updatedInputs[source].at(-1)?.type == "" &&
        updatedInputs[source].at(-1)?.validation == ""
      ) {
        updatedInputs[source].pop();
        i++;
      }
    } else {
      updatedInputs[source] = [
        ...updatedInputs[source],
        ...Array.from({ length: number - currentLength }, (_, index) => {
          return { name: "", type: "", validation: "", source, children: [] };
        }),
      ];
    }
    setInputsNumber((prevInputsNumber) => ({
      ...prevInputsNumber,
      [source]: updatedInputs[source].length,
    }));
    setInputs(updatedInputs);
  };

  const handleInputChange = (source, path, event, key) => {
    const { name, value } = event.target;
    const updatedInputs = { ...inputs };
    let current = updatedInputs[source];
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children;
    }
    console.log("current", current); 
    current[path[path.length - 1]][key] = value;
    let children = current[path[path.length - 1]].children;
    if (key === "type" && children.length > 0)
      current[path[path.length - 1]].children = [];

    setInputs(updatedInputs);

  };

  const handleAddInputZone = (source) => {
    setInputsNumber((prevInputsNumber) => ({
      ...prevInputsNumber,
      [source]: inputsNumber[source] + 1,
    }));
    setInputs({
      ...inputs,
      [source]: [
        ...inputs[source],
        { name: "", type: "", validation: "", source, children: [] },
      ],
    });
  };

  const handleRemoveInputZone = (source, path) => {
    if (path.length == 1)
      setInputsNumber((prevInputsNumber) => ({
        ...prevInputsNumber,
        [source]: inputsNumber[source] - 1,
      }));
    const updatedInputs = { ...inputs };
    let current = updatedInputs[source];
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children;
    }
    current.splice(path[path.length - 1], 1);

    setInputs(updatedInputs);
  };

  const handleAddChildInput = (path) => {
    const updatedInputs = { ...inputs };
    let current = updatedInputs["BODY"];
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]].children;
    }
    current.push({
      name: "",
      type: "",
      validation: "",
      source: "BODY",
      children: [],
    });
    setInputs(updatedInputs);
    const pathString = `${"BODY"}-${path.join("-")}`;
    if (!visiblePaths[pathString]) toggleChildrenVisibility(path);
  };

  const toggleChildrenVisibility = (path) => {
    const pathString = `${"BODY"}-${path.join("-")}`;
    setVisiblePaths((prevVisiblePaths) => ({
      ...prevVisiblePaths,
      [pathString]: !prevVisiblePaths[pathString],
    }));
  };

  const renderInputs = (source, input, path, isChildOfArray = false) => {
    const pathString = `${source}-${path.join("-")}`;
    const isVisible = visiblePaths[pathString] ?? false;
    const isArray = input.type === "ARRAY";
    const showButton =
      (input.type === "OBJECT" || input.type === "ARRAY") && source === "BODY";
  
    const getErrorMessages = (field) => {
      const fullPath = `${source}.${path.join(".")}.${field}`;
      return Object.keys(inputsErrors)
        .filter((key) => key === fullPath)
        .map((key) => <ErrorMessage key={key}>{inputsErrors[key]}</ErrorMessage>);
    };
  
    return (
      <Box mb={2} key={pathString}>
        <VStack align="stretch">
          <FormControl>
            <Flex>
              {showButton && (
                <Flex alignItems="center" ml={-5}>
                  <Box
                    bg={theme.light}
                    color="white"
                    p={1}
                    borderRadius="md"
                    _hover={{ bg: theme.strong }}
                    mr={3}
                    onClick={() => toggleChildrenVisibility(path)}
                    cursor="pointer"
                  >
                    {!isVisible ? <ChevronDownIcon /> : <ChevronUpIcon />}
                  </Box>
                </Flex>
              )}
              {!isChildOfArray && (
                <Box flex="2" mr={1} ml={showButton ? 0 : 4}>
                  <Input
                    disabled={viewOnly}
                    style={{
                      opacity: 1,
                      cursor: "default",
                    }}
                    placeholder="Name"
                    type="text"
                    value={input.name}
                    onChange={(e) => handleInputChange(source, path, e, "name")}
                    onBlur={(e) => handleInputChange(source, path, e, "name")}
                  />
                  {getErrorMessages("name")}
                </Box>
              )}
              <Box flex="1" mr={1}>
                <Select
                  disabled={viewOnly || input.loadedValue}
                  style={{
                    opacity: !input.loadedValue ? 1 : 0.5,
                    cursor: "default",
                  }}
                  value={input.type}
                  onChange={(e) => handleInputChange(source, path, e, "type")}
                  onBlur={(e) => handleInputChange(source, path, e, "type")}
                  placeholder="Select type"
                >
                  <option value="STRING">String</option>
                  <option value="NUMBER">Number</option>
                  <option value="BOOLEAN">Boolean</option>
                  {source === "BODY" && (
                    <>
                      <option value="OBJECT">Object</option>
                      <option value="ARRAY">Array</option>
                    </>
                  )}
                </Select>
                {getErrorMessages("type")}
              </Box>
              {!subFlowOutputs && (
              <Box flex="1" mr={1}>
                <Flex alignItems="center">
                    <Input
                      mr={1}
                      maxW={400}
                      disabled={viewOnly}
                      style={{
                        opacity: 1,
                        cursor: "default",
                      }}
                      placeholder="Validation"
                      type="text"
                      value={input.validation}
                      onChange={(e) =>
                        handleInputChange(source, path, e, "validation")
                      }
                    />
                    {getErrorMessages("validation")}
                </Flex>
              </Box>
              )}
              {!viewOnly && !input.loadedValue && (
                <Button
                  colorScheme="red"
                  onClick={() => handleRemoveInputZone(source, path)}
                >
                  <DeleteIcon />
                </Button>
              )}
            </Flex>
          </FormControl>
          {!viewOnly &&
            (input.type === "OBJECT" || input.type === "ARRAY") &&
            isVisible &&
            !(input.type === "ARRAY" && input.children.length > 0) && (
              <Box display="inline-flex">
                <Button size="sm" onClick={() => handleAddChildInput(path)}>
                  + Add Child
                </Button>
              </Box>
            )}
          <Box ml={path.length * 8}>
            {isVisible &&
              input.children &&
              input.children.map((child, childIndex) =>
                renderInputs(source, child, [...path, childIndex], isArray)
              )}
          </Box>
        </VStack>
      </Box>
    );
  };

  const InputsNumberCounter = ({ source }) => {
    if (viewOnly) return;
    return (
      <NumberInput
        disabled={viewOnly}
        onChange={(val) => changeInputsNumber(source, val)}
        value={inputsNumber[source]}
        min={0}
        size="md"
        width="100px"
        max={200}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
  };

  return (
    <AccordionItem >
      <AccordionButton sx={theme.accordion}>
        <Box flex="1" textAlign="left">
          <Text fontWeight="bold" fontFamily="Arial">
            {subFlowOutputs ? "Outputs" : "Inputs"}
            {NumberOfInputsErrors > 0 && (
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
                {NumberOfInputsErrors}
              </span>
            )}
          </Text>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Tabs>
          <TabList>
            <Tab>Body</Tab>
            <Tab>Header</Tab>
            {!subFlowOutputs && <Tab>Query</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex flexDirection="row" mb={4} gap={4} alignItems="center">
                {!subFlowOutputs && (
                  <RadioGroup
                    onChange={setSelectedBodyInputType}
                    value={selectedBodyInputType}
                  >
                    <Flex>
                      <Radio value="form" mr={4}>
                        Form
                      </Radio>
                      <Radio value="raw">Raw</Radio>
                    </Flex>
                  </RadioGroup>
                )}
                {selectedBodyInputType === "form" && (
                  <InputsNumberCounter
                    source="BODY"
                    onChange={(e) => setInputs(e.target.value)}
                  />
                )}
              </Flex>
              {selectedBodyInputType === "form" ? (
                <>
                  {inputs["BODY"].map((input, index) =>
                    renderInputs("BODY", input, [index])
                  )}
                  {!viewOnly && (
                    <Button
                      color="white"
                      backgroundColor={theme.strong}
                      onClick={() => handleAddInputZone("BODY")}
                    >
                      Add Body {!subFlowOutputs ? "Input" : "Output"}
                    </Button>
                  )}
                </>
              ) : (
                <Textarea
                  placeholder="Enter.."
                  size="lg"
                  disabled={viewOnly}
                  style={{
                    opacity: 1,
                    cursor: viewOnly ? "default" : "not-allowed",
                  }}
                />
              )}
            </TabPanel>
            <TabPanel>
              <Box mb={4}>
                <InputsNumberCounter source="HEADER" />
              </Box>
              {inputs["HEADER"].map((input, index) =>
                renderInputs("HEADER", input, [index])
              )}
              {!viewOnly && (
                <Button
                  color="white"
                  backgroundColor={theme.strong}
                  onClick={() => handleAddInputZone("HEADER")}
                >
                  Add Header {!subFlowOutputs ? "Input" : "Output"}
                </Button>
              )}
            </TabPanel>
            {!subFlowOutputs && (
              <TabPanel>
                <Box mb={4}>
                  <InputsNumberCounter source="QUERY" />
                </Box>
                {inputs["QUERY"]?.map((input, index) =>
                  renderInputs("QUERY", input, [index])
                )}
                {!viewOnly && (
                  <Button
                    color="white"
                    backgroundColor={theme.strong}
                    onClick={() => handleAddInputZone("QUERY")}
                  >
                    Add Query Input
                  </Button>
                )}
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default InputsView;