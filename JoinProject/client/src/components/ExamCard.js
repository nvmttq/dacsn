import React, { useEffect, useRef, useState } from "react";
import { RadioButton } from "primereact/radiobutton";

import * as constant from "../constant.js";

const Choice = ({ ques, c, selectedChoice, handleSelectChoice }) => {
  return (
    <div className={`flex items-center gap-2 ${selectedChoice === c.name ? "font-bold" : ""}`}>
      <RadioButton
        inputId={`choice${c.name}Ques${ques.id}`}
        name={`choiceQues${ques.id}}`}
        value={c.name}
        onChange={() => handleSelectChoice(ques.id, c.name)}
        checked={selectedChoice === c.name}
      />
      <label htmlFor={c.name} className="ml-2">
        {c.name}. {c.textChoice}
      </label>
    </div>
  );
};
export default function QuestionCard({ ques, examToken }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [selectedChoice, setSelectedChoice] = useState(false);

  useEffect( () => {
    ques.choice.forEach(c => {
      if(c.userChoose.find(username => username === user.username)) {
        setSelectedChoice(c.name);
      }
    });
  }, [])

  const handleSelectChoice = async (quesID, choiceName) => {
    console.log(quesID, choiceName)
    await fetch(`${constant.URL_API}/exam/set-choice`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        quesID,
        choiceName,
        examToken
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setSelectedChoice(choiceName);
        console.log(result);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="grade flex gap-x-3 p-2 rounded-md bg-white shadow text-lg mt-4">
      <div className="ques-header font-bold">Câu hỏi số {ques.id} :</div>

      <div className="ques-content flex flex-col gap-y-3">
        <div className="text-ques">{ques.textQues}</div>
        <div className="choices flex flex-col gap-y-3 choices">
          {ques.choice.map((c, index) => (
            <Choice key={c.name} handleSelectChoice={handleSelectChoice} ques={ques} c={c} selectedChoice={selectedChoice}/>
          ))}

        </div>
      </div>
    </div>
  );
}
