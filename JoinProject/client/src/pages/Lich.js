import React, { useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import axios from "axios";
import moment from "moment";


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
