import React from "react";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import "../style/GradeStyle.css";

export default function Grade(props) {

  // const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const handleCalcDateDiff = (start, end) => {
    const s = new Date(start);
    const e = new Date(end); // Replace with your desired exam date
    const timeDifference = Math.abs(e - s);
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  return (
    <div className="grade flex items-center justify-around bg-white py-2 rounded-md">
      <div className="grade-header flex flex-col w-[200px] break-words">
        <span className="title text-secondary font-bold text-lg">
          {props.title}
        </span>

        <span className="time flex items-center gap-x-2">
          <AccessAlarmsIcon className="text-icon-color" /> còn lại {handleCalcDateDiff(props.startAt, props.endAt)} ngày
        </span>
      </div>

      <div className="grade-status flex flex-col w-[150px] break-words">
        <span className="title text-secondary">Trạng thái</span>
       <span className="status">{props.status ? "Đã hoàn thành" : "Chưa làm bài"}</span>
      </div>

      <div className="grade-mark flex flex-col w-[150px] break-words">
        <span className="title text-secondary">Điểm</span>
        <span className="mark">{props.status && props.grade !== -1 ? props.grade : "Chưa chấm điểm"}</span>
      </div>

      <div className="grade-percent flex flex-col w-[150px] break-words">
        <span className="title text-secondary">Phần trăm</span>
        <span className="percent">{props.percent}</span>
      </div>
{/* 
      <Link to={props.linkTo}>
        <ChevronRightIcon
          className="view-details cursor-pointer"
          color="#76C044"
          onClick={(e) => console.log(e)}
        />
      </Link> */}
    </div>
  );
}
