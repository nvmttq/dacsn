import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as constant from "../constant.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import axios from "axios";

const shortid = require("shortid");

export default function EditExam() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const toast = useRef(null);
  
  const { examToken } = useParams();
  const [nameCourse, setNameCourse] = useState("");
  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState([]);
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
    let arr = exam;
    arr.questions[id].textQues = value;
    setExam(arr);
    fetchQuestions();
  };
  const changeChoice = ({ id, idCol, value }) => {
    let arr = exam;
    arr.questions[id].choice[idCol].textChoice = value;
    setExam(arr);
    fetchQuestions();
  };

  const removeChoice = ({ id, idRemove, idCol }) => {
    let limit = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let arr = exam;
    for (var i = 0; i < limit.length; i++) {
      if (limit[i] === arr.questions[id].answer) {
        if (i > idCol) {
          arr.questions[id].answer = limit[i - 1];
        } else if (i === idCol) {
          arr.questions[id].answer = "";
        }
      }
    }
    let remove = arr.questions[id].choice.filter((x) => x._id !== idRemove);
    arr.questions[id].choice = remove;
    arr.questions[id].choice.forEach((element, index) => {
      element.name = limit[index];
    });
    setExam(arr);
    fetchQuestions();
  };

  const changeAnswer = ({ id, answerCorrect }) => {
    let arr = exam;
    arr.questions[id].answer = answerCorrect;
    setExam(arr);
    fetchQuestions();
  };
  const changeTitleExam = ({ value }) => {
    exam.name = value;
  };
  const changeTimeLimit = ({ value }) => {
    exam.timelimit = Number(value);
  };
  
  const changePercent = ({value}) => {
    exam.percent = Number(value);
  }
  const removeQuestion = ({ id }) => {
    let arr = exam;
    arr.questions.splice(id, 1);
    setExam(arr);
    fetchQuestions();
  };
  const SaveChangeButton = async () => {
    setLoadingSaveChanges(true);
    await fetch(`${constant.URL_API}/exam/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examToken,
        exam,
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

  const fetchQuestions = () => {
    let arr = [];
    exam.questions.forEach((element, index) => {
      arr.push({
        textQues: (
          <InputTextarea
            autoResize
            value={element.textQues}
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
            {element.choice.length > 0 &&
              element.choice.map((item, ind) => (
                <div className="flex items-center">
                  <div className="mr-2">{item.name}.</div>
                  <InputText
                    value={item.textChoice}
                    onChange={(e) =>
                      changeChoice({
                        id: index,
                        idCol: ind,
                        value: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  <Button
                    label="Xóa"
                    link
                    pt={{ label: { className: "text-red-500" } }}
                    onClick={() =>
                      removeChoice({
                        id: index,
                        idRemove: item._id,
                        idCol: ind,
                      })
                    }
                  />
                </div>
              ))}
            {element.choice.length < 10 ? (
              <Button
                icon="pi pi-plus"
                className="mt-5"
                severity="help"
                onClick={() => addChoice({ id: index })}
              />
            ) : (
              <Button
                icon="pi pi-plus"
                className="mt-5"
                severity="help"
                disabled
              />
            )}
          </div>
        ),
        answer: (
          <div>
            {element.choice.length > 0 &&
              element.choice.map((item, ind) => (
                <div className="flex items-center">
                  <RadioButton
                    name={element.id}
                    value={item.name}
                    onChange={(e) => {
                      changeAnswer({ id: index, answerCorrect: e.value });
                    }}
                    checked={exam.questions[index].answer === item.name}
                  />
                  <InputText
                    value={item.name + ". " + item.textChoice}
                    disabled
                    className="ml-5 w-full"
                  />
                </div>
              ))}
          </div>
        ),
        action: (
          <div className="flex items-center">
            <Button
              icon="pi pi-trash"
              label="Xóa"
              severity="danger"
              onClick={() => removeQuestion({ id: index })}
            />
          </div>
        ),
      });
    });
    setQuestions(arr);
  };

  const [check, setCheck] = useState(false);
  useEffect(() => {
    fetch(`${constant.URL_API}/exam/${examToken}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setCheck(true);
        setExam(result);
        
        let arr = [];
        result.questions.forEach((element, index) => {
          arr.push({
            textQues: (
              <InputTextarea
                autoResize
                value={element.textQues}
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
                {element.choice.length > 0 &&
                  element.choice.map((item, ind) => (
                    <div className="flex items-center">
                      <div className="mr-2">{item.name}.</div>
                      <InputText
                        value={item.textChoice}
                        onChange={(e) =>
                          changeChoice({
                            id: index,
                            idCol: ind,
                            value: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                      <Button
                        label="Xóa"
                        link
                        pt={{ label: { className: "text-red-500" } }}
                        onClick={() =>
                          removeChoice({
                            id: index,
                            idRemove: item._id,
                            idCol: ind,
                          })
                        }
                      />
                    </div>
                  ))}
                {element.choice.length < 10 ? (
                  <Button
                    icon="pi pi-plus"
                    className="mt-5"
                    severity="help"
                    onClick={() => addChoice({ id: index })}
                  />
                ) : (
                  <Button
                    icon="pi pi-plus"
                    className="mt-5"
                    severity="help"
                    disabled
                  />
                )}
              </div>
            ),
            answer: (
              <div>
                {element.choice.length > 0 &&
                  element.choice.map((item, ind) => (
                    <div className="flex items-center">
                      <RadioButton
                        name={element.id}
                        value={item.name}
                        onChange={(e) => {
                          changeAnswer({ id: index, answerCorrect: e.value });
                        }}
                        checked={result.questions[index].answer === item.name}
                      />
                      <InputText
                        value={item.name + ". " + item.textChoice}
                        disabled
                        className="ml-5 w-full"
                      />
                    </div>
                  ))}
              </div>
            ),
            action: (
              <div className="flex items-center">
                <Button
                  icon="pi pi-trash"
                  label="Xóa"
                  severity="danger"
                  onClick={() => removeQuestion({ id: index })}
                />
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

  const AddQuestion = () => {
    let arr = [];
    questions.forEach((element) => {
      arr.push(element);
    });
    arr.push({
      textQues: (
        <InputTextarea
          value=""
          autoResize
          onChange={(e) =>
            changeQuestion({
              id: questions.length,
              value: e.target.value,
            })
          }
          rows={10}
          className="w-full"
        />
      ),
      choice: (
        <div>
          <Button
            icon="pi pi-plus"
            className="mt-5"
            severity="help"
            onClick={() => addChoice({ id: questions.length })}
          />
        </div>
      ),
      answer: <div></div>,
      action: (
        <div className="flex items-center">
          <Button
            icon="pi pi-trash"
            label="Xóa"
            severity="danger"
            onClick={() => removeQuestion({ id: questions.length })}
          />
        </div>
      ),
    });
    setQuestions(arr);
    exam.questions.push({
      id: shortid.generate(),
      textQues: "",
      choice: [],
      answer: "",
      gradeQues: 0,
    });
  };

  const addChoice = ({ id }) => {
    //console.log(id);
    let limit = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let examCopy = exam;
    let currLength = examCopy.questions[id].choice.length;
    if (currLength < 10) {
      examCopy.questions[id].choice.push({
        name: limit[currLength],
        textChoice: "",
        userChoose: [],
      });
    }
    setExam(examCopy);
    fetchQuestions();
    //console.log(exam);
  };

  return (
    <div className="px-6 py-7">
      <Toast ref={toast} />
      <button
        id="back-to-course"
        className="flex items-center font-bold mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="pi pi-angle-left text-secondary"></i>
        <span className="text-icon-color">Quay trở lại</span>
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
          <div className="percent flex items-center gap-x-2">
            <AccessTimeIcon className="text-primary" />
            <InputNumber
              value={exam.percent}
              onValueChange={(e) => changePercent({ value: e.value })}
              mode="decimal"
              min={0}
              max={100}
            />{" "}
            %
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
        <Column field="action" header="Hành động"></Column>
      </DataTable>
      <Button
        icon="pi pi-plus"
        label="Thêm câu hỏi"
        className="mt-5"
        onClick={AddQuestion}
      />
    </div>
  );
}
