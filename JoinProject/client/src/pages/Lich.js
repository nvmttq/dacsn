import React, { useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import axios, { Axios } from "axios";
function Lich() {

  const [evenCourse, setEvenCourse] = useState([]);
  const [evenn, setEvenn] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3002/lich", {})
      .then(function (response) {
        setEvenCourse(response.data.dataPosts);
      })
      .catch(function (ex) {
        console.log(ex);
      })
    console.log("1", evenCourse);


  }, []);

  const even = [ // data mẫu

    {
      _id: "653fd4de9f7a2668438072c6",
      id: 1,
      title: "Lập trình web",
      start: new Date("2023/10/30 07:00"),
      end: new Date("2023/10/30 11:30"),
    },
    {
      _id: "653fd5609f7a2668438072c7",
      id: 2,
      title: "Đồ án cơ sở ngành",
      start: new Date("2023/10/31 12:30"),
      end: new Date("2023/10/31 16:30"),
    },
  ];

  // console.log("1", even);
  return (

    <div className="mt-5">
      <Scheduler
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 6,
          startHour: 7,
          endHour: 18,
        }}
        view="week"
        events={even}
      />
    </div>
  );
}

export default Lich;
