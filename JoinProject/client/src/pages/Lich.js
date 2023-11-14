import React, { useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import axios from "axios";
import moment from "moment";
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";



function Lich() {
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [datee, setDatee] = useState(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [EVENTS, setEVENTS] = useState([]);
  console.log(EVENTS)
  useEffect(() => {
    axios
      .get("http://localhost:3002/lich", {})
      .then(function (response) {
        let temp = response.data.dataPosts;
        var rr = [];
        temp.forEach((item, i) => {
          const ts = moment(new Date(item.start)).format("YYY MM DD HH:mm");
          const te = moment(new Date(item.end)).format("YYY MM DD HH:mm");
          rr.push({
            event_id: i+1,
            title: item.title,
            start: new Date(ts),
            end: new Date(te),
          })
        })
        setEVENTS(rr);
        // console.log(EVENTS);
      })
      .catch(function (ex) {
        console.log(ex);
      });

  }, []);

  const [checkNull, setCheckNull] = useState(true);

  const postTime = (ts, te, value) => {

    axios
      .post("http://localhost:3002/lich", {
        id: 1,
        title: value,
        start: ts,
        end: te,
      })
      .then(function (res) {
        fetchDataPosts();
        setDatee(null);
        setTimeEnd(null);
        setTimeStart(null);
        setValue('');
      })
      .catch(function (er) {
        console.log(er);
      })


  }
  const fetchDataPosts = () => {
    axios
      .get("http://localhost:3002/lich", {})
      .then(function (response) {
        console.log(response);
        let temp = response.data.dataPosts;
        setEVENTS(temp.map(item => {
          let endtime = moment(item.end).format("YYYY/MM/DD HH:mm");
          let starttime = moment(item.start).format("YYYY/MM/DD HH:mm");

          const obj = {
            id: item.id,
            end: endtime,
            start: starttime,
            title: item.title,
          }
          return obj;
        }))
        // console.log(EVENTS);
      })
      .catch(function (ex) {
        console.log(ex);
      });
  }
  const changeTime = () => {
    if (datee !== null && timeEnd !== null && timeStart !== null && value !== '') {

      let td = moment(datee).format("YYYY/MM/DD");
      let ts = moment(timeStart).format("HH:mm");
      let te = moment(timeEnd).format("HH:mm");

      setCheckNull(true);
      postTime(td + " " + ts, td + " " + te, value);
      setTimeEnd(null);
      setTimeStart(null);
      setDatee(null);
    }
    else {
      setCheckNull(false);
    }
  }

  return (

    <div className="mt-5">

      {/* dialog */}
      <div className="card s flex justify-center ml-[20px]">
        <Button label="Chọn lịch học" icon="pi pi-external-link" onClick={() => setVisible(true)} />
        <Dialog header="Header" visible={visible} className="w-[1100px] " onHide={() => setVisible(false)}>
          <div className="ml-[30px] flex flex-row border-[2px] w-[1000px]">
            <div className="flex-auto">
              <label htmlFor="calendar-timeonly" className="font-bold block mb-2">
                Tên môn học
              </label>
              <InputText className="p-invalid" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="flex-auto">
              <label htmlFor="calendar-timeonly" className="font-bold block mb-2">
                Ngày học
              </label>
              <Calendar value={datee} onChange={(e) => setDatee(e.value)} showIcon />
            </div>

            <div className="flex-auto">
              <label htmlFor="calendar-timeonly" className="font-bold block mb-2">
                Giờ bắt đầu
              </label>
              <Calendar id="calendar-timeonly" value={timeStart} onChange={(e) => setTimeStart(e.value)} timeOnly />
            </div>

            <div className="flex-auto">
              <label htmlFor="calendar-timeonly" className="font-bold block mb-2">
                Giờ kết thúc
              </label>
              <Calendar id="calendar-timeonly" value={timeEnd} onChange={(e) => setTimeEnd(e.value)} timeOnly />
            </div>

          </div>
          <Button className=" ml-1/2" label="Xác nhận" onClick={() => changeTime()} />
          {checkNull === false && <p>vui lòng nhập đủ thời gian</p>}
        </Dialog>
      </div>
      {/* calendar */}
      <Scheduler
        week={{
          weekDays: [0,1,2,3,4,5,6],
          weekStartOn: 6,
          startHour: 7,
          endHour: 18,
        }}
        view="week"
        events={EVENTS}
      />

      
    </div>
  );
}

export default Lich;
