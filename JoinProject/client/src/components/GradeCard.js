import React from "react";
// import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "../style/GradeStyle.css";


export default function Grade({ grade }) {
  const handleCalcDateDiff = (start, end) => {
    const s = new Date(start);
    const e = new Date(end); // Replace with your desired exam date
    const timeDifference = Math.abs(e - s);
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };
  console.log(grade);
  return (
    <div className="grade flex items-center justify-around bg-white py-2 rounded-md">
      <div className="grade-header flex flex-col">
        <span className="title text-[#115E59] font-bold text-lg">
          {grade.name}
        </span>

        <span className="time flex items-center gap-x-2">
          {/* <AccessAlarmsIcon /> con lai{" "} */}
          {handleCalcDateDiff(grade.createAt, grade.endAt)} ngay
        </span>
      </div>

      <div className="grade-status flex flex-col">
        <span className="title text-secondary">Trạng thái</span>
        <span className="status">Chưa hoàn thành</span>
      </div>

      <div className="grade-mark flex flex-col">
        <span className="title text-secondary">Điểm</span>
        <span className="mark">A+</span>
      </div>

      <div className="grade-percent flex flex-col">
        <span className="title text-secondary">Phần trăm</span>
        <span className="percent">20%</span>
      </div>

      {/* <ChevronRightIcon
        className="view-details cursor-pointer"
        color="#76C044"
        onClick={(e) => console.log(e)}
      /> */}
    </div>
  );
}
