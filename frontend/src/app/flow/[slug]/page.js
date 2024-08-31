"use client";

import crypto from "crypto";
import { useEffect, useRef, useState } from "react";
import InfoFlow from "@/components/ProxyForm/InfoFlow";
import InputsView from "@/components/ProxyForm/Inputs";

import {
  Accordion,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Spinner,
  Switch,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useTheme } from "@/app/context/ThemeContext";
import SubFlows from "@/components/ProxyForm/SubFlows";
import Outputs from "@/components/ProxyForm/Outputs";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getFlow, patchFlow } from "@/lib/data";
import { InfoFlowSchema, InputSchema, OutputsSchema, subOutputsSchema } from "@/lib/definitions";


const EditFlow = ({ params }) => {
  const { theme } = useTheme();
  const toast = useToast();
  const flowId = parseInt(params.slug);
  if (flowId.toString() !== params.slug || isNaN(flowId)) return notFound();
  const [unknownFlow, setUnknownFlow] = useState(false);
  const [formLoaded, setFormLoaded] = useState(null);
  const [viewOnly, setViewOnly] = useState(true);

  const [infoflow, setInfoflow] = useState(null);
  const [subflows, setSubFlows] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [subOutputs, setSubOutputs] = useState([]);

  const [dataHashes, setDataHashes] = useState(null);

  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const cancelToogle = useRef();
  
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [inputsErrors, setinputsErrors] = useState({});
  const [subOutputsErrors, setSubOutputsErrors] = useState({});

  const [numberOfInfoErrors, setNumberOfInfoErrors] = useState(0);
  const [numberOfInputsErrors, setnumberOfInputsErrors] = useState(0);
  const [numberOfsubOutputsErrors, setnumberOfsubOutputsErrors] = useState(0);

  const validateInfoFlow = () => {
    if (infoflow.backendId) {
      infoflow.backendId = Number(infoflow.backendId);
    } else if (infoflow.backendId == "") {
      infoflow.backendId = null;
    }
    const validationResult = InfoFlowSchema.safeParse(infoflow);
    if (!validationResult.success) {
      const errorMessages = {};
      validationResult.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      console.log("errorM ", errorMessages);

      setNumberOfInfoErrors(
        Object.values(errorMessages).filter((error) => error !== null).length
      );

      console.log("number of errors", numberOfInfoErrors);

      return false;
    }
    setErrors({});
    setNumberOfInfoErrors(0);
    return true;
  };

  const validateInputs = () => {
    console.log("inputs", inputs);

    const validationResult = InputSchema.safeParse(inputs);
    if (!validationResult.success) {
      const errorMessages = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errorMessages[path]) {
          errorMessages[path] = [];
        }
        errorMessages[path].push(err.message);
      });

      const flattenedErrorMessages = {};
      for (const [key, messages] of Object.entries(errorMessages)) {
        flattenedErrorMessages[key] = messages.join(", ");
      }

      setinputsErrors(flattenedErrorMessages);
      console.log("errorM ", flattenedErrorMessages);

      setnumberOfInputsErrors(
        Object.values(flattenedErrorMessages).filter((error) => error !== null)
          .length
      );

      console.log(
        "number of errors",
        Object.keys(flattenedErrorMessages).length
      );

      return false;
    }
    setinputsErrors({});
    setnumberOfInputsErrors(0);
    return true;  
  };
  const validateSubOutputs = () => {

    let validationResult = subOutputsSchema.safeParse(subOutputs);
    if (infoflow.instanceApigee != "NONE" && infoflow.instanceApigee != null)
     validationResult = OutputsSchema.safeParse(outputs);

    if (!validationResult.success) {
      const errorMessages = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errorMessages[path]) {
          errorMessages[path] = [];
        }
        errorMessages[path].push(err.message);
      });

      
      const flattenedErrorMessages = {};
      for (const [key, messages] of Object.entries(errorMessages)) {
        flattenedErrorMessages[key] = messages.join(", ");
      }

      setSubOutputsErrors(flattenedErrorMessages);
      console.log("errorM ", flattenedErrorMessages);

      setnumberOfsubOutputsErrors(
        Object.values(flattenedErrorMessages).filter((error) => error !== null)
          .length
      );

      console.log(
        "number of errors",
        Object.keys(flattenedErrorMessages).length
      );

      return false;
    }
    setSubOutputsErrors({});
    setnumberOfsubOutputsErrors(0);
    return true;

  };

  const loadFlow = async () => {
    try {
      const data = await getFlow(flowId);
      if (data.status === "error") {
        toast({
          title: "Server is not responding",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (!data.id) {
        setUnknownFlow(true);
        return;
      }
      let transformed = transformFlowData(data);
      if (data.subFlowUsages.length === 0) {
        transformed.subflows = [];
      } else {
        transformed.subflows = transformSubFlows(
          data.subFlowUsages,
          data.requestMappingsList
        );
      }
      setInfoflow(transformed.infoflow);
      setInputs(transformed.inputs);

      if (
        transformed.infoflow.instanceApigee !== "NONE" &&
        transformed.infoflow.instanceApigee !== null
      ) {
        setOutputs(transformed.outputs);
        console.log("Outputs", outputs);
      } else {
        setOutputs([]);
        setSubOutputs(transformed.subOutputs);
        setOutputs([]);
        console.log("SubOutputs", transformed.subOutputs);
        console.log("Ouputs", transformed.outputs);
      }
      setSubFlows(transformed.subflows);
      setDataHashes({
        infoflow: crypto
          .createHash("sha256")
          .update(JSON.stringify(transformed.infoflow))
          .digest("hex"),
        inputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(transformed.inputs))
          .digest("hex"),
        subflows: transformed.subflows.map((x) =>
          crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex")
        ),
        outputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(transformed.outputs))
          .digest("hex"),
        subOutputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(transformed.subOutputs))
          .digest("hex"),
      });
      setFormLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFlow();
  }, []);
  if (unknownFlow) return notFound();
  if (!formLoaded) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const toogleView = () => {
    if (viewOnly === false) {
      onOpenAlert();
      return;
    } else {
      setViewOnly(false);
    }
  };
  const confirmToogle = () => {
    setViewOnly(!viewOnly);
    window.location.reload();
    onCloseAlert();
  };

  const toogleButtonStyle = {
    ".chakra-switch__track::after": {
      content: viewOnly ? '"Edit"' : '"View"',
      color: viewOnly ? "black" : "white",
      display: "block",
      position: "absolute",
      transform: "translate(-50%,-50%)",
      left: viewOnly ? "62%" : "33%",
      fontSize: "20px",
      fontFamily: "Calibri",
    },
    ".chakra-switch__track": {
      width: "80px",
      height: "30px",
      alignItems: "center",
    },
    ".chakra-switch__thumb": {
      width: "24px",
      height: "24px",
      backgroundColor: "white",
      transition: "transform 0.2s ease",
      _checked: {
        transform: "translateX(56px)",
      },
    },
  };

  const UpdateFlow = async (form) => {
    const response = await patchFlow(flowId, form);
    toast({
      title: response.message,
      position: "bottom-right",
      status: response.status,
      isClosable: true,
      duration: 3000,
    });
    if (response.status === "error") return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isInfoFlowValid = validateInfoFlow();
    const areInputsValid = validateInputs();
    const areSubOutputsValid = validateSubOutputs();
  
    if (isInfoFlowValid && areInputsValid  && areSubOutputsValid) {
      const newHashes = {
        infoflow: crypto
          .createHash("sha256")
          .update(JSON.stringify(infoflow))
          .digest("hex"),
        inputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(inputs))
          .digest("hex"),
        subflows: subflows.map((x) =>
          crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex")
        ),
        outputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(outputs))
          .digest("hex"),
        subOutputs: crypto
          .createHash("sha256")
          .update(JSON.stringify(subOutputs))
          .digest("hex"),
      };
      const formToSend = {};
      const showAll = true;
      if (newHashes.infoflow != dataHashes.infoflow || showAll)
        formToSend.infoflow = infoflow;
      if (newHashes.inputs != dataHashes.inputs || showAll)
        formToSend.inputs = inputs;

      if (infoflow.instanceApigee != "NONE" && infoflow.instanceApigee != null) {
        if (newHashes.outputs != dataHashes.outputs || showAll) {
          formToSend.outputs = outputs;
        }
      } else {
        if (newHashes.subOutputs != dataHashes.subOutputs || showAll) {
          console.log("formToSend.suboutputs: ", formToSend.subOutputs);
          formToSend.subOutputs = subOutputs;
        }
      }
      formToSend.subflows = subflows;
      console.log("formToSend: ", formToSend);

      setLoading(true);
      await UpdateFlow(formToSend);
      setLoading(false);
      
    }
  };

  return (
    <>
      <Navbar />
      <Box px={10}>
        <HStack mb={6} alignItems="center" spacing={4}>
          <Heading size="xl" textAlign="center" flex="1" color={theme.strong}>
            {viewOnly ? "View Flow" : "Edit Flow"}
          </Heading>
          <Switch
            onChange={toogleView}
            isChecked={!viewOnly}
            colorScheme="blue"
            size="lg"
            sx={toogleButtonStyle}
          />
        </HStack>
        <AlertDialog
          isOpen={isOpenAlert}
          leastDestructiveRef={cancelToogle}
          onClose={onCloseAlert}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Switch to View
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? <br /> Any changes not submitted will be lost.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelToogle} onClick={onCloseAlert}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmToogle} ml={3}>
                  Switch
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Box as="form" onSubmit={handleSubmit}>
          <Accordion>
            <InfoFlow
              infoflow={infoflow}
              setInfoflow={setInfoflow}
              viewOnly={viewOnly}
              viewEditPage={true}
              NumberOfErrors={numberOfInfoErrors}
              errors={errors}
              validateInfoFlow={validateInfoFlow}
            />
            <InputsView
              inputs={inputs}
              setInputs={setInputs}
              viewOnly={viewOnly}
              validateInputs={validateInputs}
              inputsErrors={inputsErrors}
              NumberOfInputsErrors={numberOfInputsErrors}
            />
            {infoflow.instanceApigee !== null &&
            infoflow.instanceApigee != "NONE" ? (
              <>
                <SubFlows
                  inputs={inputs}
                  subflows={subflows}
                  setSubFlows={setSubFlows}
                  viewOnly={viewOnly}
                  flowId={flowId}
                />
                <Outputs
                  inputs={inputs}
                  outputs={outputs}
                  subflows={subflows}
                  setOutputs={setOutputs}
                  viewOnly={viewOnly}
                  outputsErrors={subOutputsErrors}
                  NumberOfOutputsErrors={numberOfsubOutputsErrors}
                />
              </>
            ) : (
              <InputsView
                inputs={subOutputs}
                setInputs={setSubOutputs}
                viewOnly={viewOnly}
                subFlowOutputs={true}
                validateInputs={validateSubOutputs}
                inputsErrors={subOutputsErrors}
                NumberOfInputsErrors={numberOfsubOutputsErrors}
              />
            )}
          </Accordion>
          {!viewOnly && (
            <Center mt={4}>
              <Button
                type="submit"
                color="white"
                backgroundColor={theme.strong}
                isLoading={loading}
                loadingText="Updating Flow"
              >
                Submit
              </Button>
            </Center>
          )}
        </Box>
      </Box>
    </>
  );
};

const transformFlowData = (data) => {
  console.log("data of transformFlowData  ", data);

  const transformed = {
    flowId: data.id,
    infoflow: {
      proxyId: data.proxyId,
      name: data.name,
      subject: data.subject,
      description: data.description,
      instanceApigee: data.instanceApigee,
      domain: data.domain,
      verb: data.verb,
      path: data.path,
      backendId: data.backendId,
      ssl: data.ssl,
    },
    inputs: {
      BODY: [],
      HEADER: [],
      QUERY: [],
    },
    outputs: {
      BODY: [],
      HEADER: [],
    },
    subOutputs: {
      BODY: [],
      HEADER: [],
    },
  };
  const buildInputViewTree = (inputs, parentId = null) => {
    return inputs
      .filter((input) => input.parentId === parentId)
      .map((input) => ({
        name: input.name,
        type: input.type,
        validation: input.validation,
        source: input.source,
        inputId: input.id,
        loadedValue: true,
        children: buildInputViewTree(inputs, input.id),
      }));
  };
  const buildSubOutputsViewTree = (subOutputs, parentId = null) => {
    console.log("subOutputs ID: ", subOutputs);
    return subOutputs
      .filter((subOutput) => subOutput.parentId === parentId)
      .map((subOutput) => ({
        outputId: subOutput.id,
        name: subOutput.name,
        type: subOutput.type,
        validation: subOutput.validation,
        source: subOutput.source,
        inputId: subOutput.id,
        loadedValue: true,
        children: buildSubOutputsViewTree(subOutputs, subOutput.id),
      }));
  };
  const bodyInputs = buildInputViewTree(
    data.inputs.filter((input) => input.source === "BODY")
  );
  const headerInputs = buildInputViewTree(
    data.inputs.filter((input) => input.source === "HEADER")
  );
  const queryInputs = buildInputViewTree(
    data.inputs.filter((input) => input.source === "QUERY")
  );
  transformed.inputs.BODY = bodyInputs;
  transformed.inputs.HEADER = headerInputs;
  transformed.inputs.QUERY = queryInputs;

  const bodySubOutputs = buildSubOutputsViewTree(
    data.outputs.filter((subOutput) => subOutput.source === "BODY")
  );
  const headerSubOutputs = buildSubOutputsViewTree(
    data.outputs.filter((subOutput) => subOutput.source === "HEADER")
  );
  transformed.subOutputs.BODY = bodySubOutputs;
  transformed.subOutputs.HEADER = headerSubOutputs;

  data.outputs.forEach((output) => {
    const outputData = {
      outputId: output.id,
      name: output.name,
      validation: output.validation || "",
      source: output.source,
      mapping: output.mapping,
      type: output.type,
      origin: output.origin,
      subOutputSource: output.subOutputSource,
      loadedValue: true,
    };
    if (output.source === "BODY") {
      transformed.infoflow.instanceApigee != null
        ? transformed.outputs.BODY.push(outputData)
        : null; 
    } else if (output.source === "HEADER") {
      transformed.infoflow.instanceApigee != null
        ? transformed.outputs.HEADER.push(outputData)
        : null; 
    }
  });

  console.log("transformed: ", transformed);

  return transformed;
};
const transformSubFlows = (usages, requestMappingsList) => {
  return usages
    .sort((a, b) => a.order - b.order)
    .map((usage) => {
      const requestMappings = requestMappingsList.filter(
        (mapping) => mapping.subFlowId === usage.subFlow.id
      );
      const transformedSubFlow = {
        id: usage.subFlow.id,
        name: usage.subFlow.name,
        domain: usage.subFlow.domain,
        instanceApigee: usage.subFlow.instanceApigee,
        backendId: usage.subFlow.backendId,
        path: usage.subFlow.path,
        backend: usage.subFlow.backend,
        ssl: usage.subFlow.ssl,
        isConditional: usage.condition ? true : false,
        condition: usage.condition ?? "",
        subOutputs: {
          BODY: [],
          HEADER: [],
        },
        subInputs: usage.subFlow.inputs.map((input) => ({
          id: input.id,
          name: input.name,
          source: input.source,
          type: input.type,
          subFlowId: input.subFlowId,
          parentId: input.parentId,
        })),
        isLoaded: true,
        requestMappings: {
          BODY: [],
          HEADER: [],
          QUERY: [],
        },
      };

      const subOutputsBySource = { BODY: [], HEADER: [] };
      usage.subFlow.outputs.forEach((output, idx) => {
        const outputData = {
          subOutputId: idx,
          id: output.id,
          name: output.name,
          source: output.source,
          type: output.type,
          parentId: output.parentId,
        };
        subOutputsBySource[output.source].push(outputData);
      });
      transformedSubFlow.subOutputs = subOutputsBySource;
      transformedSubFlow.subInputs.forEach((subInput) => {
        const linkedMapping = requestMappings.find(
          (mapping) => subInput.id === mapping.subInputId
        );
        const requestMapping = {
          backend: subInput.name,
          apigee: linkedMapping?.apigee ?? "",
          source: subInput.source,
          origin: linkedMapping?.origin ?? "",
          subOutputSource: linkedMapping?.subOutputSource ?? null,
          inputId: subInput.id,
          type: subInput.type,
          parentId: subInput.parentId,
        };
        transformedSubFlow.requestMappings[subInput.source].push(
          requestMapping
        );
      });

      return transformedSubFlow;
    });
};

export default EditFlow;
