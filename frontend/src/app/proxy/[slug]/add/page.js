"use client";

import { useEffect, useState } from "react";
import InfoFlow from "@/components/ProxyForm/InfoFlow";
import InputsView from "@/components/ProxyForm/Inputs";

import {
  Accordion,
  Box,
  Button,
  Center,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useTheme } from "@/app/context/ThemeContext";
import SubFlows from "@/components/ProxyForm/SubFlows";
import Outputs from "@/components/ProxyForm/Outputs";
import Navbar from "@/components/Navbar";
import { createFlow, getProxy } from "@/lib/data";
import {
  InfoFlowSchema,
  InputSchema,
  OutputsSchema,
  subOutputsSchema,
} from "@/lib/definitions";

const AddFlow = ({ params }) => {
  const { theme } = useTheme();
  const proxyId = parseInt(params.slug);
  const toast = useToast();
  if (proxyId.toString() !== params.slug || isNaN(proxyId)) return notFound();
  const [unknownProxy, setUnknownProxy] = useState(false);
    
  useEffect(() => {
    const fetchProxy = async () => {
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
    };
    fetchProxy();
  }, [proxyId]);

  if(unknownProxy) return notFound();
  const [infoflow, setInfoflow] = useState({
    proxyId: proxyId,
    name: "",
    subject: "",
    description: "",
    instanceApigee: "NONE",
    domain: "",
    verb: "",
    path: "",
    backend: "",
    backendId: null,
  });
  const [inputs, setInputs] = useState({
    BODY: [],
    HEADER: [],
    QUERY: [],
  });
  const [subflows, setSubFlows] = useState([]);
  const [outputs, setOutputs] = useState({
    BODY: [],
    HEADER: [],
  });
  const [subOutputs, setSubOutputs] = useState({
    BODY: [],
    HEADER: [],
  });

  const [loading, setLoading] = useState(false);
  const addFlow = async () => {
    const response = await createFlow({ infoflow, inputs, subflows, outputs, subOutputs });
    toast({
      title: response.message,
      position: "bottom-right",
      status: response.status,
      isClosable: true,
      duration: 3000,
    });
    if (response.status === "error") return;
  };

  const [errors, setErrors] = useState({});
  const [inputsErrors, setinputsErrors] = useState({});
  const [subOutputsErrors, setSubOutputsErrors] = useState({});

  const [numberOfErrors, setNumberOfErrors] = useState(0);
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

      setNumberOfErrors(
        Object.values(errorMessages).filter((error) => error !== null).length
      );

      console.log("number of errors", numberOfErrors);

      return false;
    }
    setErrors({});
    setNumberOfErrors(0);
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
    if (infoflow.instanceApigee != "NONE" && infoflow.instanceApigee != null) {
      validationResult = OutputsSchema.safeParse(outputs);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isInfoFlowValid = validateInfoFlow();
    const areInputsValid = validateInputs();
    const areSubOutputsValid = validateSubOutputs();

    if (isInfoFlowValid && areInputsValid && areSubOutputsValid) {
      try {
        setLoading(true);
        await addFlow();
        setLoading(false);
        console.log({ infoflow, inputs, subflows, outputs });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Box px={10}>
        <Heading size="xl" textAlign="center" mb={6} color={theme.strong}>
          Add Flow
        </Heading>
        <Box as="form" onSubmit={handleSubmit}>
          <Accordion>
            <InfoFlow
              infoflow={infoflow}
              setInfoflow={setInfoflow}
              NumberOfErrors={numberOfErrors}
              errors={errors}
            />
            <InputsView
              inputs={inputs}
              setInputs={setInputs}
              inputsErrors={inputsErrors}
              NumberOfInputsErrors={numberOfInputsErrors}
            />

            {(infoflow.instanceApigee == null ||
              infoflow.instanceApigee !== "NONE") && (
              <SubFlows
                inputs={inputs}
                subflows={subflows}
                setSubFlows={setSubFlows}
              />
            )}
            {infoflow.instanceApigee == null ||
            infoflow.instanceApigee !== "NONE" ? (
              <Outputs
                inputs={inputs}
                outputs={outputs}
                subflows={subflows}
                setOutputs={setOutputs}
                outputsErrors={subOutputsErrors}
                NumberOfOutputsErrors={numberOfsubOutputsErrors}
              />
            ) : (
              <InputsView
                inputs={subOutputs}
                setInputs={setSubOutputs}
                subFlowOutputs={true}
                validateInputs={validateSubOutputs}
                inputsErrors={subOutputsErrors}
                NumberOfInputsErrors={numberOfsubOutputsErrors}
              />
            )}
          </Accordion>
          <Center mt={4}>
            <Button
              type="submit"
              color="white"
              backgroundColor={theme.strong}
              isLoading={loading}
              loadingText="Creating Flow"
            >
              Submit
            </Button>
          </Center>
        </Box>
      </Box>
    </>
  );
};

export default AddFlow;