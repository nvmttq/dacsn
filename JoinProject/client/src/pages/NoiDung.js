import React, { useEffect, useState } from "react";
import axios from "axios";
import { TabMenu } from "primereact/tabmenu";
import { Dropdown } from "primereact/dropdown";


import Posts from "../components/Posts";
import Contents from "../components/Contents";
import Participants from "../components/Participants.js";
import CourseDetails from "../pages/CourseDetails.js";
import Meeting from "../pages/Meeting.js";
import Grade from "../pages/Grade.js";


export default function NoiDung() {
  const currentCourses = localStorage.getItem("currentCourses")
    ? JSON.parse(localStorage.getItem("currentCourses"))
    : null;

  const [courseInformation, setCourseInformation] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:3002/get-course", {})
      .then(function (response) {
        setCourseInformation(response.data.dataCourse.filter((x => x.token == currentCourses))[0]);
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
    <>
      <div
        style={{
          // border: '1px solid red',
          marginTop: 20,
        }}
      >
        <span
          className="font-bold"
          style={{
            // border: '1px solid red',
            marginLeft: 20,
          }}
        >
          <span
            style={{
              fontSize: 18,
            }}
          >
            {courseInformation ? courseInformation.title : "Chưa vào lớp học nào!!"}
          </span>
        </span>
      </div>

      <div className="w-full h-auto mt-5 ">
        <CourseDetails />
        <div className="rounded-lg w-4/5 my-3 bg-white flex justify-start ">
          <TabMenu
            className="text-xs"
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />
        </div>
      </div>
      {activeIndex === 0 && <Contents />}
      {activeIndex === 1 && <Posts />}
      {activeIndex === 2 && <Meeting />}
      {activeIndex === 3 && <Participants/>}
      {activeIndex === 4 && <Grade/>}
    </>
  );
}
