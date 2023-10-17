import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card } from "primereact/card";
import * as constant from  "../constant.js"

export default function CourseCard() {
  const [courses, setCourses] = useState([]);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;



  useEffect(() => {
    if(user) {
      fetch(`${constant.URL_API}/courses/${user.username}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => setCourses(result));
    }
  }, [user]);



  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  const getToken = ({ token }) => {
    localStorage.setItem("currentCourses", JSON.stringify(token));
  }
  const footer = (courseToken) => {
    return (
      <Link to={`/content`} label="Vào lớp" icon="pi pi-book" onClick={() => getToken({token: courseToken})}>Vào lớp</Link>
  )};

  return (
    <>
   
      {courses.length !== 0 ? (
        <div
          className="courses-content flex flex-wrap justify-center gap-2 mt-2 h-[calc(100vh-34px-25px)]"
        
        >
          
          {courses.map((course, index) => (
            <Card
              key={index}
              title={course.title}
              subTitle="Sắp bắt đầu"
              footer={footer(course.token)}
              header={header}
              className="w-[calc(33.33333%-16px)] h-max"
            >
              <div className="m-0">
                <div className="course-info flex justify-between">
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
            </Card>
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
