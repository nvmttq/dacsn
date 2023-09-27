import React from "react";

import FormJoinCourse from "../components/FormJoinCourse.js";
import CourseCard from "../components/CourseCard.js";


function KhoaHoc() {
  return (
    <div className="courses p-2 w-full flex flex-col">
      <div className="courses-header flex justify-between items-center">
        <span className="font-bold text-white">Các khóa học theo TKB</span>
        <div className="join-course flex">
          <FormJoinCourse
            idInput={"courseToken"}
            nameInput={"courseToken"}
            text={"Nhập mã lớp học"}
            textButton={"Tham gia lớp học"}
          />
        </div>
      </div>
      <CourseCard />
    </div>
  );
}

export default KhoaHoc;
