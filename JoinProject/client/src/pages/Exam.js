import React, { useEffect, useRef, useState } from "react";
import Countdown from 'react-countdown';
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import * as constant from "../constant.js";
import ExamCard from "../components/ExamCard.js";


export default function Exam() {
  const { examToken } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const toastSubmitExam = useRef(null);
  const [isDone, setIsDone] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [exam, setExam] = useState({});
  const navigate = useNavigate();
  


  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        result.userStatus.forEach(data => {
          if(data.userID === user.username) {
            if(data.status) {
              setIsDone(true);
            }
          }
        })
        setExam(result);
      })
      .catch((err) => console.log(err));
  }, []);

  const showSubmitExam = (data) => {
    console.log(data)
    toastSubmitExam.current.show({
      severity: data.severity,
      summary: "Thông báo",
      detail: data.msg,
    });
  };

  const submitExam = async (skip = false) => {
    var count = 0;
    
    const choices = document.querySelectorAll(".choices");
    choices.forEach(choice => {
      const choiceInput = choice.querySelectorAll("input");
      choiceInput.forEach(input => {
        if(input.checked) {
          console.log(input)
          count++;
        }
      });
    });

    if(count !== exam.questions.length && skip === false) {
      const comfirm = window.confirm(`Bạn chỉ mới chọn ${count}/${exam.questions.length} đáp án. Bạn có chắc muốn nộp không ? `);
      if(!comfirm) {
        return;
      }
    }
    await fetch(`${constant.URL_API}/exam/submit-exam`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user, examToken
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        showSubmitExam(result);
        setIsDone(true);
        setStartExam(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const Completionist = () => <span>Hết thời gian làm bài !</span>;
  const ShowGrade = () => {
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    useEffect( () => {
      let correct = 0, wrong = 0;
      exam.questions.forEach(ques => {
        ques.choice.forEach(c => {
          if(c.name.toUpperCase() === ques.answer.toUpperCase()) {
              
              if(c.userChoose.find(u => u === user.username)) correct++;
              else wrong++;
          } 
        });
      });
      console.log(correct, wrong)
      setCorrect(correct);
      setWrong(wrong);
    }, []);

    return (
      <div className="flex flex-col gap-y-2">
        <span className="text-primary font-bold">Bạn đạt được</span>
        <div className="flex gap-x-2">
          <span className="font-bold">Số câu :</span>
          <span>{correct}/{correct+wrong}</span>
        </div>
        <div className="flex gap-x-2">
        <span className="font-bold">Số điểm:</span>
          <span>{(10/(correct+wrong)) * correct}/10</span>
        </div>
      </div>
    );
  }
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      submitExam(true);
      return <Completionist/>;
    } else {
      // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
  };

  const calcTimer = () => {
    console.log(exam.timelimit * 60 * 1000)
    if(exam.timelimit) return (exam.timelimit * 60 * 1000);
    return 0;
    
  }


  return (
    <div className="px-6 py-3">
      <Toast ref={toastSubmitExam} position="bottom-right"/>
      
      <button onClick={() => navigate(-1)}>BACK</button>
      <div className="bg-white flex justify-between gap-5 rounded-lg shadow p-4 md:px-6" style={{position: 'relative'}}>
        <div className="space-y-1" >
          <div className="font-bold text-sushi-400 uppercase text-sm text-primary">
            Bài tập trắc nghiệm
          </div>
          <div className="text-xl text-zinc-600 font-bold leading-6 pb-2">
            {exam.name}
          </div>
          <div className="timelimit flex items-center gap-x-2">
            <AccessTimeIcon className="text-primary"/>
            {exam.timelimit} phút
          </div>

          <div className="status bottom-3 right-3" style={{position: 'absolute'}}>
            {isDone ? <CheckIcon className="text-primary flex gap-x-2" /> : <CloseIcon className="text-red-500 flex gap-x-2"/>}
            {isDone ? <span>Đã hoàn thành</span> : <span>Chưa hoàn thành</span>}
          </div>
        </div>
      </div>
      <br></br>

      {isDone || startExam ? (
        <div className="questions px-3">
          {startExam ? <Countdown date={Date.now() + calcTimer()} renderer={renderer} /> : <div className="count-down"></div>}

          {isDone ? <ShowGrade/> : <div></div>}

          {
            exam.questions.map((ques, index) => (
              <ExamCard key={index} examToken={examToken} ques={ques} />
            ))
          }
          <div className="submit-exam">
            <Button onClick={submitExam}>NỘP BÀI</Button>
          </div>
        </div>
      ) : (
          <Button onClick={() => setStartExam(true)}>Bắt đầu thi</Button>
      )}


    </div>
  );
}
