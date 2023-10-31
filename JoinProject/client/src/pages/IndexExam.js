import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as constant from "../constant.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";
import moment from "moment";

export default function IndexExam() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const { examToken } = useParams();
  const [isDone, setIsDone] = useState(false);
  const [exam, setExam] = useState({});
  const [startExam, setStartExam] = useState(false);
  const [startAgain, setStartAgain] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [dataSubmit, setDataSubmit] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setExam(result);
        let endSubmit;
        result.userStatus.forEach((data) => {
          if (data.userID === user.username) {
            if (data.status === 2) {
              setIsDone(true);
              endSubmit = moment(data.timeEnd).format("DD/MM/YYYY HH:mm:ss");
            } else if (data.status === 1) {
              setStartExam(true);
              endSubmit = moment(data.timeEnd).format("DD/MM/YYYY HH:mm:ss");
            }
          }
        });
        let correct = 0,
          wrong = 0;
        result.questions.forEach((ques) => {
          ques.choice.forEach((c) => {
            if (c.name.toUpperCase() === ques.answer.toUpperCase()) {
              if (c.userChoose.find((u) => u === user.username)) correct++;
              else wrong++;
            }
          });
        });
        setCorrect(correct);
        setWrong(wrong);
        let score = (10 / (correct + wrong)) * correct;
        let numQuestion = correct + wrong;
        dataSubmit.push({
          lastSubmitDate: endSubmit,
          score: score.toString() + "/10",
          numberOfCorrect: correct.toString() + "/" + numQuestion.toString(),
          review: (
            <Link
              to={"/exam/review/" + examToken}
              style={{ color: "#4338CA" }}
              className="hover:underline hover:decoration-4"
            >
              Xem lại
            </Link>
          ),
          redo: (
            <Link
              to={"/exam/redo/" + examToken}
              style={{ color: "#4338CA" }}
              className="hover:underline hover:decoration-4"
            >
              Làm lại
            </Link>
          ),
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-6 py-3">
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
            Bài tập trắc nghiệm
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
      {isDone ? (
        <DataTable value={dataSubmit} tableStyle={{ minWidth: "50rem" }}>
          <Column field="lastSubmitDate" header="Nộp lần cuối"></Column>
          <Column field="score" header="Số điểm"></Column>
          <Column field="numberOfCorrect" header="Số câu đúng"></Column>
          <Column field="review" header="Xem lại"></Column>
          <Column field="redo" header="Làm lại"></Column>
        </DataTable>
      ) : (
        <div className="text-center mt-5">
          <Link
            to={"/exam/start/" + examToken}
            style={{ color: "#4338CA" }}
            className="hover:underline hover:decoration-4"
          >
            Đi đến trang làm bài
          </Link>
        </div>
      )}
    </div>
  );
}
