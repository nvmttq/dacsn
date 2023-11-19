import React, { useEffect, useState } from "react";
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
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect( () => {
    if(assignment && assignment.userStatus) {
      assignment.userStatus.forEach(g => {
        console.log(g)
        if(g.participants.find(username => user.username === username)) {
          if(g.status) setIsSubmit(true);
        }
      })
    }
  }, [])
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
              <span className="text-icon-color block">Quay trở lại</span>
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
            <span className="title text-secondary font-bold text-lg">
              {assignment.title}
            </span>

            <span className="time flex items-center gap-x-2 ">
              <AccessAlarmsIcon className="text-icon-color" />
              <span className="text-[#E9848F]">
                Hạn nộp {convertDateMongodb(assignment.timeEnd)}
              </span>
            </span>
          </div>

          <div className="grade-status flex flex-col items-center">
            <span className="title text-secondary">Trạng thái</span>
            {isSubmit ? (
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

          <span>
            <ChevronRightIcon
              className="view-details cursor-pointer"
              color="#76C044"
              onClick={() => setTypeView(assignment.assignmentToken)}
            />
          </span>
        </div>
      )}
    </>
  );
}
