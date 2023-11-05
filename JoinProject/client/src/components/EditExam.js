import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as constant from "../constant.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import moment from "moment";
import axios from "axios";

export default function EditExam() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const toast = useRef(null);

  const { examToken } = useParams();
  const [nameCourse, setNameCourse] = useState("");
  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState([]);
  const [textQuesCurrent, setTextQuesCurrent] = useState([]);
  const [choiceCurrent, setChoiceCurrent] = useState([]);
  const [answerCurrent, setAnswerCurrent] = useState([]);
  const [minutes, setMinutes] = useState(0);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const [loadingSaveChanges, setLoadingSaveChanges] = useState(false);
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Cập nhật nội dung thành công!!",
      life: 3000,
    });
  };

  const changeQuestion = ({ id, value }) => {
    let arr = [];
    textQuesCurrent.forEach((item) => {
      arr.push(item);
    });
    arr[id] = value;
    setTextQuesCurrent(arr);
  };
  const changeChoice = ({ id, idCol, value }) => {
    let arr = [];
    choiceCurrent.forEach((item) => {
      arr.push(item);
    });
    arr[id][idCol].textChoice = value;
    setChoiceCurrent(arr);
  };
  const changeAnswer = ({ id, answerCorrect }) => {
    let arr = [];
    answerCurrent.forEach((item) => {
      arr.push(item);
    });
    arr[id] = answerCorrect;
    setAnswerCurrent(arr);
  };
  const changeTitleExam = ({ value }) => {
    setTitle(value);
  };
  const changeTimeLimit = ({ value }) => {
    setMinutes(Number(value));
  };
  const SaveChangeButton = async () => {
    setLoadingSaveChanges(true);
    await fetch(`${constant.URL_API}/exam/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        textQuesCurrent,
        choiceCurrent,
        answerCurrent,
        examToken,
        minutes,
        title,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoadingSaveChanges(false);
        showSuccess();
        // console.log(result);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let arr = [];
    questions.forEach((element, index) => {
      arr.push({
        textQues: (
          <InputTextarea
            autoResize
            defaultValue={textQuesCurrent[index]}
            onChange={(e) =>
              changeQuestion({
                id: index,
                value: e.target.value,
              })
            }
            rows={10}
            className="w-full"
          />
        ),
        choice: (
          <div>
            {choiceCurrent[index].map((item, ind) => (
              <div className="flex items-center">
                <div className="mr-2">{item.name}.</div>
                <InputText
                  defaultValue={item.textChoice}
                  onChange={(e) =>
                    changeChoice({
                      id: index,
                      idCol: ind,
                      value: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>
        ),
        answer: (
          <div>
            {choiceCurrent[index].map((item, ind) => (
              <div className="flex items-center">
                <RadioButton
                  name={element.id}
                  value={item.name}
                  onChange={(e) =>
                    changeAnswer({ id: index, answerCorrect: e.value })
                  }
                  checked={answerCurrent[index] === item.name}
                />
                <InputText value={item.name} disabled className="ml-5 w-1/5" />
              </div>
            ))}
          </div>
        ),
      });
    });
    setQuestions(arr);
  }, [answerCurrent]);

  const [check, setCheck] = useState(false);
  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setCheck(true);
        setExam(result);
        setMinutes(result.timelimit);
        setTitle(result.name);
        let arrTextQues = [];
        let arrChoice = [];
        let arrAnswer = [];
        result.questions.forEach((ele, index) => {
          arrTextQues.push(ele.textQues);
          arrChoice.push(ele.choice);
          arrAnswer.push(ele.answer);
        });
        setTextQuesCurrent(arrTextQues);
        setChoiceCurrent(arrChoice);
        setAnswerCurrent(arrAnswer);
        let arr = [];
        result.questions.forEach((element, index) => {
          arr.push({
            textQues: (
              <InputTextarea
                autoResize
                defaultValue={element.textQues}
                onChange={(e) =>
                  changeQuestion({
                    id: index,
                    value: e.target.value,
                  })
                }
                rows={10}
                className="w-full"
              />
            ),
            choice: (
              <div>
                {element.choice.map((item, ind) => (
                  <div className="flex items-center">
                    <div className="mr-2">{item.name}.</div>
                    <InputText
                      defaultValue={item.textChoice}
                      onChange={(e) =>
                        changeChoice({
                          id: index,
                          idCol: ind,
                          value: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ),
            answer: (
              <div>
                {element.choice.map((item, ind) => (
                  <div className="flex items-center">
                    <RadioButton
                      name={element.id}
                      value={item.name}
                      onChange={(e) => {
                        console.log(e);
                        changeAnswer({ id: index, answerCorrect: e.value });
                      }}
                      checked={answerCurrent[index] === item.name}
                    />
                    <InputText
                      value={item.name}
                      disabled
                      className="ml-5 w-1/5"
                    />
                  </div>
                ))}
              </div>
            ),
          });
        });
        setQuestions(arr);
        axios
          .get(constant.URL_API + "/get-course", {})
          .then(function (response) {
            let course = response.data.dataCourse.filter(
              (x) => x.token === result.courseToken
            )[0];
            if (course) {
              setNameCourse(course.title);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => console.log(err));
  }, [check]);

  return (
    <div className="px-6 py-7">
      <Toast ref={toast} />
      <button
        id="back-to-course"
        className="flex items-center text-primary font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left"></i>
        <span>GO BACK</span>
      </button>
      <div
        className="bg-white flex justify-between gap-5 rounded-lg shadow p-4 md:px-6"
        style={{ position: "relative" }}
      >
        <div className="space-y-1">
          <div className="font-bold text-sushi-400 uppercase text-sm text-primary">
            Bài tập trắc nghiệm - {nameCourse}
          </div>
          <div className="text-xl text-zinc-600 font-bold leading-6 pb-2">
            <InputText
              defaultValue={exam.name}
              onChange={(e) =>
                changeTitleExam({
                  value: e.target.value,
                })
              }
              className="w-full"
            />
          </div>
          <div className="timelimit flex items-center gap-x-2">
            <AccessTimeIcon className="text-primary" />
            <InputNumber
              value={exam.timelimit}
              onValueChange={(e) => changeTimeLimit({ value: e.value })}
              mode="decimal"
              min={0}
              max={1000000000}
            />{" "}
            phút
          </div>
        </div>
        <div className="flex">
          <Button
            label="Lưu thay đổi"
            icon="pi pi-check"
            loading={loadingSaveChanges}
            onClick={() => {
              SaveChangeButton();
            }}
            className="mb-5 h-1/3"
            severity="success"
          />
        </div>
      </div>
      <br></br>
      <DataTable
        showGridlines
        value={questions}
        tableStyle={{ minWidth: "50rem" }}
        className="mt-5"
      >
        <Column field="textQues" header="Câu hỏi"></Column>
        <Column field="choice" header="Lựa chọn"></Column>
        <Column field="answer" header="Đáp án"></Column>
      </DataTable>
    </div>
  );
}
