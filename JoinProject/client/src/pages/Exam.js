import React, { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import * as constant from "../constant.js";
import ExamCard from "../components/ExamCard.js";

import axios from "axios";

export default function Exam() {
  const { examToken } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const toastSubmitExam = useRef(null);
  const [nameCourse, setNameCourse] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [startAgain, setStartAgain] = useState(false);
  const [exam, setExam] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setExam(result);
        result.userStatus.forEach((data) => {
          if (data.userID === user.username) {
            if (data.status === 2) {
              setIsDone(true);
            } else if (data.status === 1) {
              setStartExam(true);
            }
          }
        });
        axios
          .get(constant.URL_API + "/get-course", {})
          .then(function (response) {
            let course = response.data.dataCourse.filter(
              (x) => x.token === result.courseToken
            )[0];
            if (course) {
              setNameCourse(course.title);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => console.log(err));
  }, []);

  const showSubmitExam = (data) => {
    console.log(data);
    toastSubmitExam.current.show({
      severity: data.severity,
      summary: "Thông báo",
      detail: data.msg,
    });
  };

  const submitExam = async (skip = false) => {
    var count = 0;

    const choices = document.querySelectorAll(".choices");
    choices.forEach((choice) => {
      const choiceInput = choice.querySelectorAll("input");
      choiceInput.forEach((input) => {
        if (input.checked) {
          console.log(input);
          count++;
        }
      });
    });

    if (count !== exam.questions.length && skip === false) {
      const comfirm = window.confirm(
        `Bạn chỉ mới chọn ${count}/${exam.questions.length} đáp án. Bạn có chắc muốn nộp không ? `
      );
      if (!comfirm) {
        return;
      }
    }
    await fetch(`${constant.URL_API}/exam/submit-exam`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        examToken,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("SUBMIT", skip, result);
        window.scrollTo({
          top: 10,
          behavior: "smooth",
        });
        setIsDone(true);
        setStartExam(false);
        setExam(result.exam);
        setStartAgain(false);
        let correct = 0,
          wrong = 0;
        result.exam.questions.forEach((ques) => {
          ques.choice.forEach((c) => {
            if (c.name.toUpperCase() === ques.answer.toUpperCase()) {
              if (c.userChoose.find((u) => u === user.username)) correct++;
              else wrong++;
            }
          });
        });
        let score = (10 / (correct + wrong)) * correct;
        let numQuestion = correct + wrong;
        axios
          .post(constant.URL_API + "/post-submitHistory", {
            idUser: user.username,
            idExam: examToken,
            lastSubmit: moment().format("DD-MM-YYYY HH:mm:ss"),
            point: score.toString() + "/10",
            correctAnswer: correct.toString() + "/" + numQuestion.toString(),
            numberOfCorrect: correct,
            exam: result.exam,
          })
          .then(function (res) {
            showSubmitExam(result);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Completionist = () => <span>Hết thời gian làm bài !</span>;
  const ShowGrade = () => {
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    useEffect(() => {
      let correct = 0,
        wrong = 0;
      exam.questions.forEach((ques) => {
        ques.choice.forEach((c) => {
          if (c.name.toUpperCase() === ques.answer.toUpperCase()) {
            if (c.userChoose.find((u) => u === user.username)) correct++;
            else wrong++;
          }
        });
      });
      console.log(correct, wrong);
      setCorrect(correct);
      setWrong(wrong);
    }, []);

    return (
      <div className="flex flex-col gap-y-2">
        <span className="text-primary font-bold">Bạn đạt được</span>
        <div className="flex gap-x-2">
          <span className="font-bold">Số câu :</span>
          <span>
            {correct}/{correct + wrong}
          </span>
        </div>
        <div className="flex gap-x-2">
          <span className="font-bold">Số điểm:</span>
          <span>{(10 / (correct + wrong)) * correct}/10</span>
        </div>
      </div>
    );
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      submitExam(true);
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const handleStartExam = async () => {
    await fetch(`${constant.URL_API}/exam/start-exam`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        examToken,
      }),
    })
      .then((response) => response.json())
      .then(async (result) => {
        console.log("START ", result);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setExam(result.exam);
        setStartExam(true);
        setIsDone(false);
        setStartAgain(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calcTimer = () => {
    let timeStart = null;
    let checkUserPending = null;
    exam.userStatus.find((u) => {
      if (u.status === 1 && u.userID === user.username) {
        timeStart = new Date(u.timeStart);
        checkUserPending = u;
      }
    });

    if (checkUserPending) {
      if (exam.timelimit) {
        const timelimit = exam.timelimit * 60 * 1000;
        const dateNow = new Date();
        const dateDiff = dateNow - timeStart;
        console.log(dateDiff, timeStart, dateNow);
        const minutes = dateDiff;
        if (minutes > timelimit) {
          submitExam(true);
          return;
        }
        return timelimit - minutes;
      }
    }

    return exam.timelimit * 60 * 1000;
  };

  return (
    <div className="px-6 py-3">
      <Toast ref={toastSubmitExam} position="bottom-right" />

      <button
        id="back-to-course"
        className="flex items-center text-primary font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left"></i>
        <span>GO BACK</span>
      </button>
      <div
        className="bg-white flex justify-between gap-5 rounded-lg shadow p-4 md:px-6"
        style={{ position: "relative" }}
      >
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

          <div
            className="status bottom-3 right-3"
            style={{ position: "absolute" }}
          >
            {isDone ? (
              <CheckIcon className="text-primary flex gap-x-2" />
            ) : (
              <CloseIcon className="text-red-500 flex gap-x-2" />
            )}
            {isDone ? <span>Đã hoàn thành</span> : <span>Chưa hoàn thành</span>}
          </div>
        </div>
      </div>
      <br></br>

      {isDone || startExam ? (
        <div className="questions px-3">
          {startExam ? (
            <Countdown date={Date.now() + calcTimer()} renderer={renderer} />
          ) : (
            <div className="count-down"></div>
          )}

          {isDone ? <ShowGrade /> : <div></div>}

          {exam.questions.map((ques, index) => (
            <ExamCard
              key={index}
              examToken={examToken}
              ques={ques}
              isDone={isDone}
              startAgain={startAgain}
            />
          ))}
          <div className="submit-exam mt-3 gap-3">
            <Button onClick={() => submitExam(false)} disabled={isDone}>
              {" "}
              {isDone ? "Đã nộp bài" : "NỘP BÀI"}
            </Button>
            <Button
              onClick={handleStartExam}
              visible={exam.numberOfTimes > 0 && isDone}
            >
              Làm lại
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Button onClick={handleStartExam}>Bắt đầu thi</Button>
        </div>
      )}
    </div>
  );
}
