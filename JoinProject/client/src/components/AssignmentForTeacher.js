import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import axios from "axios";
import * as constant from "../constant.js";
import { Link, useParams } from "react-router-dom";
import ParticipantsAssignmentForTeacher from "./ParticipantsAssignment.js";
export default function AssignmentForTeacher() {
  const { assignToken } = useParams();
  const [assignment, setAssignment] = useState({});
  const [course, setCourse] = useState({});
  const convertDateMongodb = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };

  useEffect(() => {
    axios
      .post(`${constant.URL_API}/assignments/get-assign`, {
        assignToken,
      })
      .then(function (res) {
        setAssignment(res.data.assignment);
        setCourse(res.data.course);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    // <div>{assignment.title}</div>
    <div className=" mt-[15px] flex flex-col pb-3">
      <Link
        to="/"
        id="back-to-course"
        className="flex items-center font-bold mb-4"
      >
        <i className="pi pi-angle-left text-secondary"></i>
        <span className="text-icon-color">Quay trở lại</span>
      </Link>
      <span className="font-medium text-xl">
        Khóa học : {course.title}
      </span>
      <div className="mt-[30px]">
        <div className="ass-title mb-4">
          <p className="font-medium text-xl">Tên bài tập: {assignment.title}</p>
          <p className="text-muted mt-[5px]">
            Hạn nộp bài đến {convertDateMongodb(assignment.timeEnd)}
          </p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-xl">Hướng dẫn</span>
          <p className="text">
            {assignment.content && assignment.content.text}
          </p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-xl">Tài liệu</span>
          <div className="ass-files">
            {assignment.content &&
              assignment.content.file.map((f, i) => {
                return <div key={i}>{f}</div>;
              })}
          </div>
        </div>
      </div>

      {assignment.userStatus && (
        <ParticipantsAssignmentForTeacher assignment={assignment} />
      )}
    </div>
  );
}
