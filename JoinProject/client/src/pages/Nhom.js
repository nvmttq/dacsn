import React from "react";

import FormJoinCourse from "../components/FormJoinCourse.js";
import GroupCard from "../components/GroupCard.js";

function KhoaHoc() {
  return (
    <div className="courses p-2 w-full flex flex-col">
      <div className="courses-header flex justify-between items-center">
        <span className="font-bold text-white">Các nhóm đã tham gia</span>
        <div className="join-course flex">
        <FormJoinCourse idInput={"groupToken"} nameInput={"groupToken"} text={"Nhập mã nhóm"} textButton={"Tham gia nhóm"}/>
        </div>
      </div>
      <GroupCard />
    </div>
  );
}

export default KhoaHoc;
