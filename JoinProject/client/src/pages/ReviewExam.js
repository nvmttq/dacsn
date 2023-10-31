import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import * as constant from "../constant.js";
import ReviewQuestionCard from "../components/ReviewQuestionCard.js";

export default function Exam() {
  const { examToken } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [exam, setExam] = useState({});
  const totalCorrect = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/exam/review/${examToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          totalCorrect.current = result.totalCorrect;
          setExam(result.exam);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="px-10 py-3">
      <button
        id="back-to-course"
        className="flex items-center text-primary font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left"></i>
        <span>GO BACK</span>
      </button>

      <div className="bg-white flex justify-between gap-5 rounded-lg shadow p-4 md:px-6">
        <div className="space-y-1">
          <div className="font-bold text-sushi-400 uppercase text-sm">
            Bài tập
          </div>
          <div className="text-xl text-zinc-600 font-bold leading-6 pb-2">
            {exam.name}
          </div>
          <div className="timelimit">{exam.timelimit} phút</div>
        </div>
      </div>
      <br></br>
      <div>
        Bạn đã đạt{" "}
        {`${totalCorrect.current}/${
          exam.questions ? exam.questions.length : 0
        }`}
      </div>
      {exam.questions ? (
        exam.questions.map((ques, index) => (
          <ReviewQuestionCard key={index} ques={ques} />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}
