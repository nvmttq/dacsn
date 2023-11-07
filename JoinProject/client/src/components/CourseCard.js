import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card } from "primereact/card";
import * as constant from "../constant.js";

export default function CourseCard() {
  const [courses, setCourses] = useState([]);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/courses/${user.username}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => setCourses(result));
    }
  }, []);

  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  const getToken = ({ token }) => {
    localStorage.setItem("currentCourses", JSON.stringify(token));
  };
  const footer = (courseToken) => {
    return (
      <Link
        to={`/courses/${courseToken}`}
        label="Vào lớp"
        icon="pi pi-book"
        onClick={() => getToken({ token: courseToken })}
      >
        Vào lớp
      </Link>
    );
  };

  return (
    <>
      {courses.length !== 0 ? (
        <div className="courses-content mt-2 h-[calc(100vh-34px-25px)] flex flex-wrap gap-4 items-stretch">
          {courses.map((course, index) => (
            <div key={index} className="card1 bg-white flex flex-col w-[25%] h-[60%] rounded-md">
              <div className="card-top">
                <img
                  alt="Card"
                  src="https://primefaces.org/cdn/primereact/images/usercard.png"
                  className="w-full h-[100px] flex-shrink"
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div className="card-body p-4 flex flex-col flex-grow">
                <div className="card-title text-lg text-black font-bold break-words">{course.title}</div>
                <div className="card-content flex justify-between mt-auto">
                  <div className="course-token flex items-center gap-2">
                    <i className="icon pi pi-key text-green-600 text-xl"></i>
                    <div className="token flex flex-col">
                      <span className="font-bold">{course.token}</span>
                      <span>Mã khóa học</span>
                    </div>
                  </div>
                  <div className="course-assigment flex items-center gap-2">
                    <i className="pi pi-book text-green-600 text-xl" />
                    <div className="flex flex-col">
                      <span className="font-bold">{course.assignment}</span>
                      <span className="label">Bài tập</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer p-4">
                <Link
                  to={`/courses/${course.token}`}
                  label="Vào lớp"
                  icon="pi pi-book"
                  onClick={() => getToken({ token: course.token })}
                >
                  Vào lớp
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold">
          BẠN CHƯA THAM GIA LỚP HỌC NÀO
        </div>
      )}
    </>
  );
}
