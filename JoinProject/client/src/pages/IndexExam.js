import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as constant from "../constant.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";
import axios from "axios";

export default function IndexExam({ setIdReview }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const { examToken } = useParams();
  const [nameCourse, setNameCourse] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [exam, setExam] = useState({});
  const [startExam, setStartExam] = useState(false);
  const [startAgain, setStartAgain] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [dataSubmit, setDataSubmit] = useState([]);
  const navigate = useNavigate();

  const settingOptions = [{ name: "Chỉnh sửa", code: "CS" }];

  useEffect(() => {
    setDataSubmit([]);
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
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
        setCorrect(correct);
        setWrong(wrong);
        axios
          .get(constant.URL_API + "/get-submitHistory", {})
          .then(function (res) {
            let arr = [];
            let submitHistory = res.data.dataSubmitHistory
              .filter(
                (x) => x.idUser === user.username && x.idExam === examToken
              )
              .reverse();
            submitHistory.forEach((submit) => {
              arr.push({
                lastSubmitDate: submit.lastSubmit,
                score: submit.point,
                numberOfCorrect: submit.correctAnswer,
                review: (
                  <Link
                    to={"/exam/review/" + examToken}
                    style={{ color: "#4338CA" }}
                    className="hover:underline hover:decoration-4"
                    onClick={() => setIdReview(submit._id)}
                  >
                    Xem lại
                  </Link>
                ),
              });
            });
            setDataSubmit(arr);
          })
          .catch(function (error) {
            console.log(error);
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

  const solveOptions = (e) => {
    if (e.value.code === "CS") {
      navigate("/exam/edit/" + examToken);
    }
  };

  return (
    <div className="px-6 py-7 h-screen">
      <button
        id="back-to-course"
        className="flex items-center font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left text-secondary"></i>
        <span className="text-icon-color">GO BACK</span>
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
      <div className="pt-4 pb-4">
        <Dropdown
          onChange={solveOptions}
          options={settingOptions}
          optionLabel="name"
          placeholder="Cài đặt"
          className={`${user.role !== "Sinh Viên" ? "" : "hidden"}`}
        />
        <Link
          
          to={"/exam/redo/" + examToken}
          className="float-right bg-emerald-400 pt-3 pb-3 pl-6 pr-6 rounded-2xl text-white hover:bg-emerald-600 hover:duration-300"
          style={{
            display: `${isDone ? "block" : "none"}`
          }}
        >
          Làm lại
        </Link>
      </div>

      {isDone ? (
        <div>
          <DataTable value={dataSubmit} tableStyle={{ minWidth: "50rem" }}>
            <Column field="lastSubmitDate" header="Thời gian nộp"></Column>
            <Column field="score" header="Số điểm"></Column>
            <Column field="numberOfCorrect" header="Số câu đúng"></Column>
            <Column field="review" header="Xem lại"></Column>
          </DataTable>
        </div>
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
