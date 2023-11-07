import React, { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";

import * as constant from "../constant.js";
import { Toast } from "primereact/toast";

export default function ParticipantsAssignmentForTeacher({ assignment }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const toastGrade = useRef(null);
  const [participants, setParticipants] = useState([]);
  console.log(participants);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(null);
  const [groups, setGroups] = useState([]);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      fullName: { value: "", matchMode: "contains" },
      mssv: { value: "", matchMode: "contains" },
      group: { value: "", matchMode: "contains" },
      grade: { value: "", matchMode: "contains" },
      files: { value: "", matchMode: "contains" },
    },
  });
  let networkTimeout = null;

  useEffect(() => {
    loadGroupOfCourse();
    loadLazyData();
  }, []);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    //imitate delay of a backend call
    networkTimeout = setTimeout(() => {
      console.log(assignment.userStatus);
      let requests = assignment.userStatus.map((us) =>
        fetch(`${constant.URL_API}/users/get-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants: us.participants,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            return {
              users: data,
              assignmented: us.assignmented,
              dateSubmit: us.dateSubmit,
              status: us.status,
              grade: us.grade,
            };
          })
      );
      Promise.all(requests).then((responses) => {
        setParticipants(responses);
        setTotalRecords(responses.length);
        console.log(responses);
        setLoading(false);
      });
    }, Math.random() * 1000 + 250);
  };

  const loadGroupOfCourse = () => {
    fetch(`${constant.URL_API}/groups/get-groups-in-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseToken: assignment.courseToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const mssvBodyTemplate = (rowData) => {
    return (
      <div>
        {rowData.users.map((user, i) => (
          <div key={i}>{user.username}</div>
        ))}
      </div>
    );
  };

  const fullNameBodyTemplate = (rowData) => {
    console.log(rowData);
    return (
      <div className="fullname-student flex flex-col items-center">
        {rowData.users.map((user, i) => (
          <span key={i}>{user.nameDisplay}</span>
        ))}
      </div>
    );
  };

  const gradeBodyTemplate = (rowData) => {
    const enableInputnumber = async (e) => {
      const input = e.target.parentNode.querySelector("span input");
      e.target.parentNode
        .querySelector("span input")
        .classList.toggle("p-disabled");
      e.target.parentNode
        .querySelector("span input")
        .removeAttribute("disabled");

      const isCheck = e.target.classList.contains("pi-check");
      if (isCheck) {
        await fetch(`${constant.URL_API}/assignments/set-grade`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grade: input.value,
            username: rowData.users[0].username,
            assignToken: assignment.assignmentToken,
          }),
        })
          .then((res) => res.json())
          .then(async (ret) => {
            if (ret.code === 500) {
              await toastGrade.current.show({
                severity: "warn",
                summary: "Cảnh báo",
                detail: "Chỉ có thể điền điểm ở dạng số và >= 0 && <= 10",
                life: 3000,
              });

              return ret;
            }
            console.log(ret);
            setParticipants((prev) =>
              prev.map((p) => {
                if (p.users.find((u) => u.username === user.username)) {
                  p.grade = parseFloat(input.value);
                }
                return p;
              })
            );
            toastGrade.current.show({
              severity: "success",
              summary: "Success",
              detail: "Message Content",
              life: 3000,
            });
          })
          .catch((err) => console.log(err));
      }
      e.target.classList.toggle("pi-check");
      console.log(e.target.parentNode.querySelector("span input"));
    };
    return (
      <div className="flex gap-2 items-center ">
        <InputNumber
          type="number"
          min={0}
          max={10}
          value={rowData.grade}
          disabled={true}
        ></InputNumber>
        <i
          className="pi pi-pencil bg-blue-500 p-2 text-white cursor-pointer"
          onClick={enableInputnumber}
        ></i>
      </div>
    );
  };

  const filesBodyTemplate = (rowData) => {
    return (
      <div>
        {rowData.assignmented && rowData.assignmented.length > 0 ? (
          rowData.assignmented.map((f, i) => (
            <a
              key={i}
              href={f.base64}
              download={f.name}
              style={{
                color: "rgb(67, 56, 202)",
                textUnderlineOffset: "under",
              }}
              className="hover:underline block"
            >
              {i+1}. {f.name}
            </a>
          ))
        ) : (
          <div>Chưa nộp</div>
        )}
      </div>
    );
  };

  const groupBodyTemplate = (rowData) => {
    let idGroup = -1;
    const username = rowData.users[0].username;

    groups.forEach((g, i) => {
      if (idGroup !== -1) return;
      g.participants.forEach((p) => {
        if (p.userID === username) {
          idGroup = i + 1;
          return;
        }
      });
    });
    return <span>{idGroup === -1 ? "Chưa có nhóm" : `Nhóm ${idGroup}`}</span>;
  };

  return (
    <div className="card">
      <Toast ref={toastGrade} />
      <DataTable
        size={"small"}
        value={participants}
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

        {groups && groups.length > 0 && (
          <Column
            field="group"
            header="Nhóm"
            body={groupBodyTemplate}
            filter
            filterField="group"
            filterPlaceholder="Search"
          />
        )}

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
        />
        <Column
          field="files"
          sortable
          body={filesBodyTemplate}
          filter
          header="Tệp đã nộp"
          filterField="files"
          filterPlaceholder="Search"
        />
        <Column
          field="grade"
          header="Điểm"
          body={gradeBodyTemplate}
          filter
          filterField="grade"
          filterPlaceholder="Search"
        />
      </DataTable>
    </div>
  );
}
