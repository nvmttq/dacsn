import React, { useState, useRef } from "react";
import AssignmentCard from "../components/AssignmentCard";



export default function Assignments({assignments, group}) {

  const [typeView, setTypeView] = useState(null);

  return (
    <>
        {!assignments ? (
        <div className="assignments flex flex-col gap-y-2 px-3">Chưa có bài tập nào</div>
      ) : (
        <div className="assignments flex flex-col gap-y-2 px-3">
          {assignments.map((assignment, index) => (
            <AssignmentCard key={index} assignment={assignment} group={group} typeView={typeView} setTypeView={setTypeView}/>
          ))}
        </div>
      )}
    </>
  );
}
