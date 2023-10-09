import React, { useRef } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const classCorrectAnswer = (isChecked, choosed, correct) => {
  if (isChecked) {
    if (choosed === correct) return "text-green-500 font-bold";
    else return "text-red-500 font-bold";
  }

  return "";
};

const iconCorrectAnswer = (isChecked, choosed, correct) => {
  if (isChecked) {
    if (choosed === correct)
      return <CheckOutlinedIcon style={{ color: "green" }} />;
    else return <CloseOutlinedIcon style={{ color: "red" }} />;
  }

  return "";
};

export default function QuestionCard({ ques, totalCorrect }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  
  const isChecked = useRef(false);
  function userChooseAnswer(userChoose) {
    const checked = userChoose.find((userID) => userID === user.username);
    console.log(checked, user.username, userChoose);
    if (checked) {
      isChecked.current = true;
      return true;
    }
    isChecked.current = false;
    return false;
  }
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
                checked={userChooseAnswer(c.userChoose)}
                disabled={true}
              />
              <div
                className={`flex items-center gap-2 ${classCorrectAnswer(
                  isChecked.current,
                  c.name,
                  ques.answer
                )}`}
              >
                <span className="font-bold">{c.name}.</span>
                <span>{c.textChoice}</span>
                <span className="correct">
                  {iconCorrectAnswer(isChecked.current, c.name, ques.answer)}
                </span>
              </div>
            </div>
          ))}
          <br />
          <div>
            ANSWER IS : <span className="font-bold">{ques.answer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
