import React, { useEffect, useState } from "react";

import moment from "moment";

import UploadAssignment from "../components/UploadAssignment.js";

export default function AssignmentDetails(props) {
  const [assignment, setAssignment] = useState(props.assignment);
  const [group, setGroup] = useState(props.group);
  const [assignmented, setAssginmented] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const convertDateMongodb = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };


  useEffect( () => {
    const t=  assignment.userStatus.filter(data => 
      data.participants.find(p => p === user.username)
    );
    console.log(t);
    setAssginmented(t[0].assignmented);
  }, [assignment]);
  return (
    <div className=" mt-[15px] flex">
      <div className=" w-4/5 mt-[30px]">
        <div className="ass-title mb-4">
          <p className="font-medium text-xl">Tên bài tập: {assignment.title}</p>
          <p className="text-muted mt-[5px]">
            Hạn nộp bài đến {convertDateMongodb(assignment.timeEnd)}
          </p>
        </div>

        <div className="mb-4">
          <span className="font-[500]">Hướng dẫn</span>
          <p className="text">{assignment.content.text}</p>
        </div>

        <div className="mb-4">
          <span className="font-[500]">Tài liệu</span>
          <div className="ass-files">
            {assignment.content.file.map((f, i) => {
              return <div key={i}>{f}</div>;
            })}
          </div>
        </div>

        <div id="ass-work">
          <span className="font-[500] mb-4 block">Các tài liệu đã nộp</span>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {assignmented && assignmented.map((f, i) => {
              return (<a key={i} href={f.base64} download={f.name} style={{
                color: 'rgb(67, 56, 202)',
                textUnderlineOffset: 'under'
              }} className="hover:underline">{f.name}</a>);
            })}
          </div>
          <UploadAssignment group={group} assignment={assignment} setAssignment={setAssignment}/>
        </div>
      </div>

      <div className=" w-1/5 mt-[30px]">
        <p className="font-normal decoration-red">Điểm </p>
      </div>
    </div>
  );
}
