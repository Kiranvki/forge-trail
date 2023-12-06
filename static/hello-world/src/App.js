import React, { useEffect, useState, Fragment, forwardRef } from "react";
import { events, invoke, view, requestJira } from "@forge/bridge";
import Button, { ButtonGroup } from "@atlaskit/button";
import api, { asApp, route } from "@forge/api";
import { Checkbox } from "@atlaskit/checkbox";
import { authorize, asUser, storage } from "@forge/api";
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import TextArea from '@atlaskit/textarea';
import { Grid, Box, Stack, Text } from '@atlaskit/primitives';
import { Label } from "@atlaskit/form";
import { AsyncSelect, OptionsType, CreatableSelect } from '@atlaskit/select';
import Heading from '@atlaskit/heading';

//Json Imports
// import Master from './Utility/MasterJson.json'
import Master from './Utility/app-config.json'

// import { issueResolver } from "../../../src";
//styled components
import { Card, ScrollContainer, Row, Form } from "./Style";


function App() {
  const [checkboxStates, setCheckboxStates] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  const [checkboxDropdownValues, setCheckboxDropdownValues] = useState({});
  const [dataReading, setDataReading] = useState("Yes")
  const [workProduct, setWorkProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [value, setValue] = useState("SW Code")


  //Function for handling checkbox
  const onChange = (checkboxName) => async (e) => {
    setCheckboxStates({
      ...checkboxStates,
      [checkboxName]: e.target.checked,
    });
    localStorage.setItem(`value${checkboxName}`, e.target.checked);
  };

  //Function for handling Dropdownvalue
  const handleDropdownSelection = (checkboxName, selectedValue) => {
    console.log(`Checkbox ${checkboxName} selected value: ${selectedValue}`);
    setDataReading(selectedValue)
    setCheckboxDropdownValues({
      ...checkboxDropdownValues,
      [checkboxName]: selectedValue,
    });
  };

  const fetchData = async () => {
    try {
      const context = await view.getContext();
      const issueTypeId = context.extension.issue.typeId;
      const projectKey = context.extension.project.key;

      const response = await invoke('fetch-workProductType', { issueTypeId, projectKey });
      setIsLoading(true)
      if (response) {
        await filterOptions(response.jiraResponse)
        setIsLoading(false)
      }
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  const filterOptions = async (response) => {
    try {
      const options = response.map((product) => ({
        label: product.value,
        value: product.id,
      }));
      setWorkProduct(options); // Set the options in the workProduct state
      return options; // Return the options
    } catch (error) {
      console.error('Error filtering options:', error);
      return [];
    }
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption && selectedOption.label) {
      const selectedValue = selectedOption.label;
      console.log(`selected value: ${selectedValue}`);
      setValue(selectedValue);
    } else {
      console.log('No valid selection');
      setValue(""); // Set the value to an empty string or handle it as needed
    }
  };



  useEffect(() => {
    //calling FetchData Functions
    fetchData()
    const storedCheckboxStates = JSON.parse(
      localStorage.getItem("checkboxStates") || "{}"
    );
    setCheckboxStates(storedCheckboxStates);
  }, []);

  useEffect(() => {
    localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
  }, [checkboxStates]);


  // const masterDataReading = () => {
  //   console.log('value', value)
  //   if (value === "") {
  //     return []
  //   } else if (value === "SW Code") {
  //     return Master.checklist["SW Code"]
  //   } else if (value === "Sys Requirement Spec") {
  //     return Master.checklist["Sys Requirement Spec"]
  //   } else if (value === "SW High Level Design") {
  //     return Master.checklist["SW High Level Design"]
  //   } else if (value === "SW Detailed Design") {
  //     return Master.checklist["SW Detailed Design"]
  //   } else if (value === "SW Unit Test Spec") {
  //     return Master.checklist["SW Unit Test Spec"]
  //   } else if (value === "SW Integration Test Spec") {
  //     return Master.checklist["SW Integration Test Spec"]
  //   } else if (value === "SW Functional Test Spec") {
  //     return Master.checklist["SW Functional Test Spec"]
  //   } else if (value === "Sys Requirement Spec") {
  //     return Master.checklist["Sys Requirement Spec"]
  //   } else {
  //     return []
  //   }
  // }

  const masterDataReading = () => {
    if (value === "") {
      return [];
    }

    const selectedChecklist = Master.checklist[value];

    if (!selectedChecklist) {
      return [];
    }

    return selectedChecklist.topics.map((topic) => ({
      topic: topic.topic,
      result: selectedChecklist.result,
    }));
  };




  return (
    <Card>
      {/* //style={{display:dataReading==""?"none":"flex"}} */}
      <Stack space="space.400">
        <Box padding="space.200">
          <Grid
            testId="grid-basic"
            rowGap="space.200"
            columnGap="space.200"
            templateColumns="150px 2fr"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              {/* <Text variant="body" as="strong">
                Work Product Type
              </Text> */}
              <h2 style={{ verticalAlign: "bottom", display: "inline-flex", lineHeight: 2.3, fontSize: "0.85714em", fontWeight: 600 }}>Work Product Type</h2>
            </Box>
            <Box>
              <CreatableSelect
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={handleSelect}
                // onCreateOption={this.handleCreate}
                options={workProduct}
              // value={value}
              />

            </Box>
          </Grid>
        </Box>
        <Box>
          {masterDataReading().map((item, index) => (
            <Fragment>
              <Row key={index} >
                <Grid
                  testId="grid-basic"
                  rowGap="space.200"
                  columnGap="space.200"
                  templateColumns="1fr 100px 1fr"
                  alignItems="center"
                >
                  <Box>
                    <Checkbox
                      isChecked={checkboxStates[`checkbox${index + 1}`]}
                      onChange={onChange(`checkbox${index + 1}`)}
                      label={item.topic}
                      name={`checkbox${index + 1}`}
                    />
                  </Box>
                  <Box>
                    <DropdownMenu trigger={
                      checkboxDropdownValues[`checkbox${index + 1}`]
                        ? checkboxDropdownValues[`checkbox${index + 1}`]
                        : "Result"
                    } >
                      <DropdownItemGroup>
                        {item.result.map((newVal, resultIndex) => (
                          <DropdownItem
                            key={resultIndex}
                            isSelected={checkboxDropdownValues[`checkbox${index + 1}`]}
                            onClick={() =>
                              handleDropdownSelection(
                                `checkbox${index + 1}`,
                                `${newVal.name}`
                              )
                            }
                          >
                            {newVal.name}
                          </DropdownItem>
                        ))}
                        {/* <DropdownItem isSelected={checkboxDropdownValues[`checkbox${index + 1}`]} onClick={() => handleDropdownSelection(`checkbox${index + 1}`, `${"Yes"}`)}>Yes</DropdownItem>
                        <DropdownItem isSelected={checkboxDropdownValues[`checkbox${index + 1}`]} onClick={() => handleDropdownSelection(`checkbox${index + 1}`, `${"No"}`)} >No</DropdownItem>
                        <DropdownItem isSelected={checkboxDropdownValues[`checkbox${index + 1}`]} onClick={() => handleDropdownSelection(`checkbox${index + 1}`, `${"Unassiagned"}`)}>Unassiagned</DropdownItem> */}
                      </DropdownItemGroup>
                    </DropdownMenu>
                  </Box>
                  <Box>
                    <Form >
                      <TextArea
                        style={{ minHeight: "40px" }}
                        placeholder="Add a comment..."
                        id="area"
                        resize="auto"
                        maxHeight="5vh"
                        name="area"
                      />
                    </Form>
                  </Box>
                </Grid>
              </Row>
            </Fragment>
          ))}
        </Box>
      </Stack>
    </Card >
  );
}

export default App;
