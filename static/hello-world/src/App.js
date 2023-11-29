import React, { useEffect, useState, Fragment } from "react";
import { events, invoke, view, requestJira } from "@forge/bridge";
import Button, { ButtonGroup } from "@atlaskit/button";
import api, { asApp, route } from "@forge/api";
import { Checkbox } from "@atlaskit/checkbox";
import { authorize, asUser } from "@forge/api";

//styled components

import { Card, ScrollContainer, Row } from "./Style";

function App() {
  const [data, setData] = useState("");
  const [newData, setNewData] = useState("");
  const [checkboxStates, setCheckboxStates] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  const [display, setDisplay] = useState("");
  
  // const handleSubmit = async () => {
  //   const response = await api
  //     .asApp()
  //     .requestJira(route`/rest/api/2/issue/TES-1/transitions`);
  //   console.log("kiran", await response.text());
  // };

  // console.log(`Number of comments on this issue: ${comments.length}`);

  // const fetchCommentsForIssue = async (issueIdOrKey) => {
  //   const res = await api
  //     .asUser()
  //     .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`);

  //   const data = await res.json();
  //   return data.comments;

  const getContext = async () => {
    const context = await view.getContext();
    setData(context.extension.issue.id);
    console.log("context", context.extension.issue.key);
    // return context;
  };

  const onChange = (checkboxName) => (e) => {
    setCheckboxStates({
      ...checkboxStates,
      [checkboxName]: e.target.checked,
    });

    // If you need to save the checked state in localStorage
    localStorage.setItem(`value${checkboxName}`, e.target.checked);
  };

  useEffect(() => {
    getContext();
    // handleSubmit();
    invoke('fetch-total').then((res)=>{
      console.log('fetc', res) 
      setNewData(res)
    })
    const storedCheckboxStates = JSON.parse(
      localStorage.getItem("checkboxStates") || "{}"
    );
    setCheckboxStates(storedCheckboxStates);
  }, []);

  useEffect(() => {
    localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
  }, [checkboxStates]);

  const checklistData = [
    "Raising PR Defects, Defect-B or Defect-C or",
    "Directly in the work product (e.g. comments option in documents) or",
    "In the review feature of the tool (e.g. DNG)",
    "In the Issue Form (Doc No: 3034)",
  ];

  // const Rows = () => {
  //   <Fragment>
  //     {checklistData.map((item) => {
  //       return (
  //         // console.log('item', item)
  //         <div>
  //           <span>{item}</span>
  //         </div>

  //         // <Row>
  //         //   {/* <Checkbox
  //         //     isChecked={checkboxStates.checkbox1}
  //         //     label={item}
  //         //     name={item}
  //         //     onChange={onChange("checkbox1")}
  //         //   /> */}
  //         //   <span>{item}</span>
  //         // </Row>
  //       );
  //     })}
  //   </Fragment>;
  // };

  return (
    <Card>
      <ScrollContainer>
        {/* <Rows /> */}
        {checklistData.map((item, index) => (
          <Row key={index}>
            <Checkbox
              isChecked={checkboxStates[`checkbox${index + 1}`]}
              onChange={onChange(`checkbox${index + 1}`)}
              label={item}
              name={`checkbox${index + 1}`}
            />
          </Row>
        ))}
        {/* <Checkbox
          isChecked={checkboxStates.checkbox1}
          onChange={onChange("checkbox1")}
          label={`Review Checklist`}
          name="controlled-checkbox"
        />
        <Checkbox
          isChecked={checkboxStates.checkbox2}
          onChange={onChange("checkbox2")}
          label={`Review Checklist2`}
          name="controlled-checkbox"
        /> */}

        <div>{newData ? JSON.stringify(newData) : 'Loading...'}</div>
      </ScrollContainer>
    </Card>
  );
}

export default App;
