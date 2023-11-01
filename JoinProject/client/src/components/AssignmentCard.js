import React from "react";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import moment from "moment";

import AssignmentDetails from "../pages/AssignmentDetails.js";
import { Button } from "primereact/button";

export default function AssignmentCard({
  group,
  assignment,
  typeView,
  setTypeView,
}) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const handleCalcDateDiff = (start, end) => {
    const s = new Date(start);
    const e = new Date(end); // Replace with your desired exam date
    const timeDifference = Math.abs(e - s);
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const convertDateMongodb = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };
  // shadow hover:shadow-lg
  return (
    <>
      {typeView && assignment.assignmentToken === typeView ? (
        <div id="view-details-assignment">
          <div className="ass-header flex justify-between items-center">
            <div
              id="back-to-list-assignment"
              className="flex items-center font-bold cursor-pointer"
              onClick={() => setTypeView(null)}
            >
              <i className="pi pi-angle-left text-gray-400"></i>
              <span className="text-primary block">Quay trở lại</span>
            </div>
            <Button className="p-0 px-3 py-2 uppercase font-[500] rounded-md">
              Nộp bài
            </Button>
          </div>
          <AssignmentDetails
            assignment={assignment}
            group={group}
          />
        </div>
      ) : (
        <div
          onClick={() => setTypeView(assignment.assignmentToken)}
          className={`grade flex items-center justify-around bg-white py-2 rounded-md shadow hover:shadow-lg`}
          style={{
            display: `${typeView ? 'none' : 'flex'}`
          }}
        >
          <div className="grade-header flex flex-col">
            <span className="title text-[#115E59] font-bold text-lg">
              {assignment.title}
            </span>

            <span className="time flex items-center gap-x-2 ">
              <AccessAlarmsIcon className="text-primary" />
              <span className="text-[#E9848F]">
                Hạn nộp {convertDateMongodb(assignment.timeEnd)}
              </span>
            </span>
          </div>

          <div className="grade-status flex flex-col items-center">
            <span className="title text-secondary">Trạng thái</span>
            {assignment.status ? (
              <div className="status flex items-center gap-x-2">
                <i className="pi pi-check"></i>
                <span>Đã nộp bài</span>
              </div>
            ) : (
              <div className="status flex items-center gap-x-2">
                <i className="pi pi-times"></i>
                <span>Chưa nộp bài</span>
              </div>
            )}
          </div>

          <Link to={`/assignments/${assignment.assignmentToken}`}>
            <ChevronRightIcon
              className="view-details cursor-pointer"
              color="#76C044"
              onClick={(e) => console.log(e)}
            />
          </Link>
        </div>
      )}
    </>
  );
}
