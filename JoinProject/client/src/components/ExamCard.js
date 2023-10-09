import React, { useRef } from "react";




export default function QuestionCard({ ques, saveUserChoose }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  
    console.log(saveUserChoose)
  return (
    <div className="grade flex gap-x-3 p-2 rounded-md bg-white shadow">
      <div className="ques-header font-bold">Câu hỏi số {ques.id} :</div>

      <div className="ques-content flex flex-col gap-y-3">
        <div className="text-ques">{ques.textQues}</div>
        <div className="choice">
          {ques.choice.map((c, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name={`choice${ques.id}`}
                onClick={() =>  {
                    saveUserChoose.current[ques.id] = index
                }}
              />
              <div
                className={`flex items-center gap-2`}
              >
                <span className="font-bold">{c.name}.</span>
                <span>{c.textChoice}</span>
              </div>
            </div>
          ))};

        </div>
      </div>
    </div>
  );
}
