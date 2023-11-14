import React, { useEffect,  useState } from "react";
import {  useNavigate} from "react-router-dom";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import * as constant from "../constant.js";
import ReviewQuestionCard from "../components/ReviewQuestionCard.js";

export default function Exam({ idReview }) {
  // const { examToken } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [exam, setExam] = useState({});
  const [nameCourse, setNameCourse] = useState("");
  const [totalCorrect, setTotalCorrect] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // fetch(`${constant.URL_API}/exam/review/${examToken}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: user.username,
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((result) => {
      //     console.log(result);
      //     totalCorrect.current = result.totalCorrect;
      //     setExam(result.exam);
      //   })
      //   .catch((err) => console.log(err));
      axios
        .get(constant.URL_API + "/get-submitHistory", {})
        .then(function (response) {
          let submitHistory = response.data.dataSubmitHistory.filter(
            (x) => x._id === idReview
          )[0];
          setExam(submitHistory.exam);
          setTotalCorrect(submitHistory.numberOfCorrect);
          axios
            .get(constant.URL_API + "/get-course", {})
            .then(function (response) {
              let course = response.data.dataCourse.filter(
                (x) => x.token === submitHistory.exam.courseToken
              )[0];
              if (course) {
                setNameCourse(course.title);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="px-10 py-3">
      <button
        id="back-to-course"
        className="flex items-center font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left text-secondary"></i>
        <span className="text-icon-color">GO BACK</span>
      </button>

      <div className="bg-white flex justify-between gap-5 rounded-lg shadow p-4 md:px-6">
        <div className="space-y-1">
          <div className="font-bold text-sushi-400 uppercase text-sm text-primary">
            Bài tập trắc nghiệm - {nameCourse}
          </div>
          <div className="text-xl text-zinc-600 font-bold leading-6 pb-2">
            {exam.name}
          </div>
          <div className="timelimit flex items-center gap-x-2">
            <AccessTimeIcon className="text-primary" />
            {exam.timelimit} phút
          </div>
        </div>
      </div>
      <br></br>
      <div>
        Bạn đã đạt {totalCorrect}/{exam.questions ? exam.questions.length : 0}
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
