import React, { useEffect, useState } from "react";
import axios from "axios";
import { TabMenu } from "primereact/tabmenu";

import Posts from "../components/Posts";
import Contents from "../components/Contents";
import Participants from "../components/Participants.js";
import Meeting from "../pages/Meeting.js";
import Grade from "../pages/Grade.js";
import Attendance from "../pages/Attendance";
import { Link } from "react-router-dom";



export default function NoiDung() {

  const [user, setUser] = useState(localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null);
  const [isPermissionOnCourse, setIsPermissionOnCourse] = useState(false);

  const currentCourses = localStorage.getItem("currentCourses")
    ? JSON.parse(localStorage.getItem("currentCourses"))
    : null;

  const [courseInformation, setCourseInformation] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:3002/get-course", {})
      .then(function (response) {
        const course = response.data.dataCourse.filter((x) => x.token === currentCourses)[0];
        setCourseInformation(
          course
        );
        course.participants.forEach(p => {
          if(p.isTeacher && p.userID === user.username) {
            setIsPermissionOnCourse(true);
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [currentCourses]);

  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: "Nội dung", icon: "pi pi-fw pi-book" },
    { label: "Diễn đàn", icon: "pi pi-fw pi-comments" },
    { label: "Cuộc họp", icon: "pi pi-fw pi-phone" },
    { label: "Thành viên", icon: "pi pi-fw pi-file" },
    { label: "Bảng điểm", icon: "pi pi-fw pi-file" },
    { label: "Điểm danh", icon: "pi pi-fw pi-check" },
  ];

  return (
    <div className=" h-screen">
      <div className="mt-[15px] flex flex-col">
        <Link
          to="/"
          id="back-to-course"
          className="flex items-center font-bold mb-4"
        >
          <i className="pi pi-angle-left text-secondary"></i>
        <span className="text-icon-color">Quay trở lại</span>
        </Link>
        <span className="font-bold text-xl text-secondary">
        {courseInformation
              ? courseInformation.title
              : "Chưa vào lớp học nào!!"}
        </span>
      </div>

      <div className="w-full h-auto mt-5 ">
        <div className="rounded-lg w-4/5 my-3 bg-white flex justify-start ">
          <TabMenu
            className="text-xs"
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />
        </div>
      </div>
      {activeIndex === 0 && <Contents isPermissionOnCourse={isPermissionOnCourse}/>}
      {activeIndex === 1 && <Posts isPermissionOnCourse={isPermissionOnCourse}/>}
      {activeIndex === 2 && <Meeting />}
      {activeIndex === 3 && <Participants isPermissionOnCourse={isPermissionOnCourse}/>}
      {activeIndex === 4 && <Grade isPermissionOnCourse={isPermissionOnCourse}/>}
      {activeIndex === 5 && <Attendance courseToken={courseInformation.token} isPermissionOnCourse={isPermissionOnCourse}/>}
    </div>
  );
}
