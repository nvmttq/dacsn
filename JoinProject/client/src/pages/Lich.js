import React, { useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import axios, { Axios } from "axios";
import moment from "moment";
import { Button } from 'primereact/button';

let evenmain = [];

function Lich() {

  useEffect(() => {
    axios
      .get("http://localhost:3002/lich", {})
      .then(function (response) {
        let temp = response.data.dataPosts;
        // setEvenCourse(response.data.dataPosts);
        // console.log(response.data.dataPosts);
        // console.log(evenCourse);
        evenmain=[];
        temp.map(item => {
          var endTime = moment(item.end).format("YYYY/MM/DD HH:MM");
          var startTime = moment(item.start).format("YYYY/MM/DD HH:MM");

          const obj = {
            id: item.id,
            end: moment(endTime),
            start: moment(startTime),
            title: item.title,
          }
          evenmain.push(obj);
        })
        console.log(temp);
      })
      .catch(function (ex) {
        console.log(ex);
      });

  }, []);

  const [evenCourse, setEvenCourse] = useState([]);
  const [sett, settt] = useState([]);



  const even = [ // data mẫu

    {
      _id: "653fd4de9f7a2668438072c6",
      id: 1,
      title: "Lập trình web",
      start: moment("2023/10/30 07:00"),
      end: moment("2023/10/30 11:30"),
    },
    {
      _id: "653fd5609f7a2668438072c7",
      id: 2,
      title: "Đồ án cơ sở ngành",
      start: moment("2023/10/31 12:30"),
      end: moment("2023/10/31 16:30"),
    },
  ];
  // console.log(moment("2023/10/31 16:30"));
  // var ime = moment("2023-10-30T04:00:00.000Z").format("YYYY/MM/DD HH:MM");
  // console.log(moment("2023-10-30T04:00:00.000Z").format("YYYY/MM/DD HH:MM"));
  // console.log(moment(ime));

  // const AddTime = () => {
  //   axios
  //     .post("http://localhost:3002/lich", {
  //       id: 1,
  //       title: "Lập trình web",
  //       start: moment("2023/10/30 07:00"),
  //       end: moment("2023/10/30 11:30"),
  //     })
  //     .then(function (res) {
  //       fetchDataPosts()
  //     })
  //     .catch(function (er) {
  //       console.log(er);
  //     })
  // }

  // const fetchDataPosts = () => {
  //   axios
  //     .get("http://localhost:3002/lich", {})
  //     .then(function (response) {
  //       // settt(response.data.dataPosts);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  return (

    <div className="mt-5">
      {/* <Button className="bg-black ml-20px" onClick={AddTime()} /> */}
      <Scheduler
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 6,
          startHour: 7,
          endHour: 18,
        }}
        view="week"
        events={evenmain}
      />
    </div>
  );
}

export default Lich;
