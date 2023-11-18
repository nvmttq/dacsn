import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as constant from "../constant.js";

export default function CourseCard() {
  const [courses, setCourses] = useState([]);

  const [user, setUser] = useState(localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null);
  console.log(user);
  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/courses/${user.username}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => setCourses(result));
    }
  }, [user]);

  const getToken = ({ token }) => {
    localStorage.setItem("currentCourses", JSON.stringify(token));
  };


  return (
    <>
      {courses.length !== 0 ? (
        <div className="courses-content mt-4 flex flex-wrap gap-5 h-max justify-center">
          {courses.map((course, index) => (
            <div key={index} className="card1 bg-white flex flex-col w-[25%] rounded-md transition duration-300 ease-in-out hover:scale-110 shadow-lg">
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
                <div className="card-title text-lg text-zinc-600 font-bold break-words">{course.title}</div>
                <div className="card-content flex justify-between mt-auto pt-3">
                  <div className="course-token flex items-center gap-2">
                    <i className="icon pi pi-key text-icon-color text-xl"></i>
                    <div className="token flex flex-col">
                      <span className="font-bold text-secondary">{course.token}</span>
                      <span>Mã khóa học</span>
                    </div>
                  </div>
                  <div className="course-assigment flex items-center gap-2">
                    <i className="pi pi-book text-icon-color text-xl" />
                    <div className="flex flex-col">
                      <span className="font-bold text-secondary">{course.assignment}</span>
                      <span className="label">Bài tập</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer px-4 py-2">
                <Link
                  to={`/courses/${course.token}`}
                  label="Vào lớp"
                  icon="pi pi-book"
                  onClick={() => getToken({ token: course.token })}
                  className="p-button p-component p-button-link font-medium p-0 underline"
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
