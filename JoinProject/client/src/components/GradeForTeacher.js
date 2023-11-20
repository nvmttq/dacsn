import React, { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import * as constant from "../constant.js";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";


export default function ParticipantsAssignmentForTeacher({ courseToken, isPermissionOnCourse}) {
  // const user = localStorage.getItem("user")
  //   ? JSON.parse(localStorage.getItem("user"))
  //   : null;
  const toastGrade = useRef(null);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  console.log(grades);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(null);
  const cols = useRef([
    {field: "fullName", header: "Họ và Tên"},
    {field: "mssv", header: "MSSV"}
  ]);
  let exportColumns = null;
  const dt = useRef(null);

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      fullName: { value: "", matchMode: "contains" },
      mssv: { value: "", matchMode: "contains" },
    },
  });
  let networkTimeout = null;

  useEffect(() => {
    loadLazyData();
  }, []);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    //imitate delay of a backend call
    networkTimeout = setTimeout(async () => {
      await fetch(`${constant.URL_API}/grades/get-grade-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseToken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setExams(data.exams);
          setAssignments(data.assignments);
          // let requests = data;

          // Promise.all(requests).then((responses) => {
          //   setGrades(responses);
          //   setTotalRecords(responses.length);
          //   console.log(responses);
          //   setLoading(false);
          // });
          const gradesUser = data.course.participants.map((user) => {
            let gradesUser = {
              username: user.userID,
              quizAssignments: [],
              fileAssignments: [],
            };

            data.assignments.forEach((assign) => {
              assign.userStatus.forEach((u, i) => {
                cols.current.push({
                  field: `Assign${i}`,
                  header: assign.title
                });
                if (
                  u.participants.find((username) => user.userID === username)
                ) {
                  const temp = {
                    grade: 0,
                    fileName: "",
                    fileToken: "",
                    percent: 0,
                    status: false
                  }
                  temp.fileName = assign.title;
                  temp.fileToken = assign.assignmentToken;
                  temp.percent = assign.percent;
                  temp.grade = u.grade;
                  temp.status = (u.status ? true : false);
                  gradesUser.fileAssignments.push(temp);
                }
              });
            });

            data.exams.forEach((exam) => {
              exam.userStatus.forEach((u, i) => {
                cols.current.push({
                  field: `Exam${i}`,
                  header: exam.name
                });
                if (
                  u.userID === user.userID
                ) {
                  const temp = {
                    grade: 0,
                    quizName: "",
                    quizToken: "",
                    percent: 0,
                    status: false
                  }

                  temp.grade = u.grade;
                  temp.percent = exam.percent;
                  temp.quizName = exam.name;
                  temp.quizToken = exam.id;
                  temp.status = (u.status === 2 ? true : false);
                  gradesUser.quizAssignments.push(temp);

                }
              });
            });

            return gradesUser;
          });

          setTotalRecords(gradesUser.length);
          setGrades(gradesUser);
          setLoading(false);
          console.log(cols)
          exportColumns = cols.current.map((col) => ({ title: col.header, dataKey: col.field }));
        });
    }, Math.random() * 1000 + 250);
  };

  const onPage = (event) => {
    setlazyState(event);
  };

  const onSort = (event) => {
    console.log(event);
    setlazyState(event);
  };

  const onFilter = (event) => {
    event["first"] = 0;
    setlazyState(event);
  };

  const onSelectionChange = (event) => {
    const value = event.value;

    setSelectedParticipants(value);
    setSelectAll(value.length === totalRecords);
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      // ParticipantsDataTableService.getParticipants({
      //   lazyEvent: JSON.stringify(lazyState),
      // }).then((data) => {
      //   setSelectAll(true);
      //   setSelectedParticipants(data);
      // });
    } else {
      setSelectAll(false);
      setSelectedParticipants([]);
    }
  };


  const exportCSV = (selectionOnly) => {
    console.log(dt)
    dt.current.exportCSV({ selectionOnly });
};

const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);

            doc.autoTable(exportColumns, grades);
            doc.save('grades.pdf');
        });
    });
};

const exportExcel = () => {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(grades);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'grades');
    });
};

const saveAsExcelFile = (buffer, fileName) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
        const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

        // Save the Blob as a file
        module.default.saveAs(blob, 'example.txt');
          // let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          // let EXCEL_EXTENSION = '.xlsx';
          // const data = new Blob([buffer], {
          //     type: EXCEL_TYPE
          // });

          // module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};

const header = (
  <div className="flex items-center justify-end gap-2">
      <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(true)} data-pr-tooltip="CSV" />
      <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
      <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
  </div>

);

  const mssvBodyTemplate = (rowData) => {
    return <div></div>;
  };

  const fullNameBodyTemplate = (rowData) => {
    console.log(rowData);
    return (
      <div className="fullname-student flex flex-col items-center">
        {rowData.username}
      </div>
    );
  };


  const assignBodyTemplate = (e, assign) => {

    const fileAssign= (e.fileAssignments.find(f => f.fileToken === assign.assignmentToken));
 
    return (
      <div className="fullname-student flex flex-col items-center">
        {/* {rowData.username} */}
        {fileAssign && fileAssign.status ? (fileAssign.grade === -1 ? "Chưa chấm điểm" : fileAssign.grade) : "Chưa nộp bài"}
      </div>
    );
  };
  
  const examBodyTemplate = (e, exam) => {

    const quizAssign= (e.quizAssignments.find(q => q.quizToken === exam.id));
    console.log("QUIZ ASSIGN ", quizAssign);
    return (
      <div className="fullname-student flex flex-col items-center">
        {/* {rowData.username} */}
        {quizAssign.status ? quizAssign.grade : "Chưa nộp bài"}
      </div>
    );
  };

  const summaryGradeTemplate = (e) => {
    let grade = 0;
    (e.quizAssignments.forEach(q => {
      grade += parseFloat((q.percent*q.grade)/100.0)
      console.log(parseFloat((q.percent*q.grade)/100.0))

    }));
    (e.fileAssignments.forEach(f => {
      grade += parseFloat((f.percent*f.grade)/100.0)
      console.log(parseFloat((f.percent*f.grade)/100.0))
    }));
    return (
      <span>{grade < 0 ? "?" : grade}</span>
    );
  };

  return (
    <div className="card">
      <Toast ref={toastGrade} />
      <DataTable
        emptyMessage="No students found."
        header={isPermissionOnCourse ? header : null}
        ref={dt}
        size={"small"}
        value={grades}
        lazy
        filterDisplay="row"
        dataKey="id"
        paginator
        first={lazyState.first}
        rows={10}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        onFilter={onFilter}
        filters={lazyState.filters}
        loading={loading}
        selectionMode={"checkbox"}
        tableStyle={{ minWidth: "50rem" }}
        selection={selectedParticipants}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        {/* all asignment by idcourse */}
        {/* all exam by idcourse */}
        {/* all grade by exam */}
        <Column
          field="mssv"
          header="MSSV"
          body={mssvBodyTemplate}
          sortable
          filter
          filterField="mssv"
          filterPlaceholder="Search"

        />

        <Column
          field="fullName"
          sortable
          header="Họ tên"
          filterField="fullName"
          body={fullNameBodyTemplate}
          filter
          filterPlaceholder="Search"
          headerStyle={{width: 'max-content'}}
        />

        {assignments.map((assign,i) => (
          <Column
            key={i}
            field={`Assign${i}`}
            header={assign.title}
            body={(e) => assignBodyTemplate(e, assign)}
          />
        ))}

        {exams.map((exam,i) => (
          <Column
            key={i}
            field={`Exam${i}`}
            header={exam.name}
            body={(e) => examBodyTemplate(e, exam)}
          />
        ))}

        <Column
        field="Summary Grade"
        header={"Tổng điểm"}
        body={(e) => summaryGradeTemplate(e)}>

        </Column>
      </DataTable>
    </div>
  );
}
