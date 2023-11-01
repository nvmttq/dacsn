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
import moment from "moment";
import axios from "axios";

export default function EditExam() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const { examToken } = useParams();
  const [nameCourse, setNameCourse] = useState("");
  const [exam, setExam] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setExam(result);
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

  return (
    <div className="px-6 py-7">
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
        </div>
      </div>
      
    </div>
  );
}
