import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import moment from "moment";

import * as constant from "../constant.js";

export default function Attendance({ courseToken, isPermissionOnCourse}) {

  
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [attendances, setAttendances] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmitAttend, setLoadingSubmitAttend] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [isChange, setIsChange] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(`${constant.URL_API}/attendances/${courseToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const attendances = data.attendances.map(at => {

          const solveUs = [];
          at.userStatus.forEach(us => {
            console.log(us)
            if(user.role === "Sinh Viên") {
              if(us.user.username === user.username) solveUs.push(us);
            } else {
              solveUs.push(us)
            }
            
          });
          at.userStatus = solveUs;
          return at;
        })
        console.log(attendances)
      
        setAttendances(attendances);
        setSelectedParticipants(data.selectedUsers)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [courseToken, isChange]); // eslint-disable-line react-hooks/exhaustive-deps



  const expandAll = () => {
    let _expandedRows = {};

    attendances.forEach((p) => (_expandedRows[`${p.token}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    return rowData && rowData.userStatus && rowData.userStatus.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    console.log("ASFASF",data)

    const submitAttendance = async (e) => {
      setLoadingSubmitAttend(true);
      await fetch(`${constant.URL_API}/attendances/submit-atten`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedUsers: selectedParticipants,
          attendanceToken: data.token
        }),
      }).then(res => res.json()).then(data => {
        console.log(data)
        setAttendances(data.attendances);
      }).catch(err => console.log(err)).finally(() => setLoadingSubmitAttend(false))
    };
    const footer = (
      <Button onClick={submitAttendance} loading={loadingSubmitAttend}>Hoàn thành điểm danh</Button>
    );

    const mssvBodyTemplate = (rowData) => {
      
      return <span>{rowData.user.username}</span>;
    };

    console.log(data);
    const fullNameBodyTemplate = (rowData) => {
      
      return <span>{rowData.user.name}</span>;
    };

    const statusBodyTemplate = (rowData) => {
      
      const getStatusSeverity = (rowData) => {
        if (rowData.status) return "success";
        return "danger";
      };
      return (
        <Tag
          value={rowData.status ? "Có mặt" : "Vắng"}
          severity={getStatusSeverity(rowData)}
        ></Tag>
      );
    };
    const onSelectionChange = (event) => {
      const value = event.value;
      console.log(selectedParticipants)
      setSelectedParticipants(value);
      // setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event) => {
      const selectAll = event.checked;

      if (selectAll) {
        setSelectAll(true);
        setSelectedParticipants(attendances);
      } else {
        setSelectAll(false);
        setSelectedParticipants([]);
      }
    };
    return (
      <div className="p-3">
        <h5>Điểm danh {data.title}</h5>
        <DataTable
          value={data.userStatus}
          footer={user.role !== "Sinh Viên" ? footer : null}
          lazy
          dataKey="user._id"
          paginator
          rows={10}
          totalRecords={data.userStatus.length}
          tableStyle={{ minWidth: "55rem" }}
          selection={selectedParticipants[data.token]} 
          onSelectionChange={(e) => {
            console.log(e.value);
            setSelectedParticipants({
              ...selectedParticipants,
              [data.token]: e.value
            })
          }}
        >
          <Column
            field="mssv"
            header="MSSV"
            body={mssvBodyTemplate}
            sortable
          ></Column>
          <Column
            field="fullName"
            header="Họ tên"
            body={fullNameBodyTemplate}
            sortable
          ></Column>
          <Column
            field="status"
            header="Trạng thái"
            body={statusBodyTemplate}
            sortable
          ></Column>
          <Column style={{
            display: `${user.role !== "Sinh Viên" ? "block" : "none"}`
          }} selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        </DataTable>
      </div>
    );
  };

  const titleBodyTemplate = (rowData) => {
    return <span>{rowData.title}</span>;
  };

  const dateCreateBodyTemplate = (rowData) => {
    return (
      <span>{moment(rowData.CreateAt).format("DD-MM-YYYY HH:mm:ss")}</span>
    );
  };

  const summaryBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.yes === 0 && rowData.no === 0 ? (
          <span>Chưa điểm danh</span>
        ) : (
          <span>
            Có {rowData.yes} | Vắng {rowData.no}
          </span>
        )}
      </>
    );
  };

  const createAttendance = () => {
    fetch(`${constant.URL_API}/attendances/create`, {
      method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseToken
        }),
    }).then(res => res.json()).then(res => {
      console.log(res);
      setIsChange(prev => !prev)
  


    }).catch(err => {
      console.log(err);
    }).finally( () => {
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Thêm điểm danh mới thành công"
      })
    })
  }
  const header = (
    
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Mở rộng tất cả" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Thu nhỏ tất cả"
        onClick={collapseAll}
        text
      />
      <Button
        icon="pi pi-plus"
        label="Tạo điểm danh"
        onClick={createAttendance}
        text
        className=" float-right block"
        style={{
          display: `${isPermissionOnCourse ? "" : "none"}`
        }}
      />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        value={attendances}
        loading={loading}
        selectionMode={'sigel'}
        tableStyle={{ minWidth: "50rem" }}
        expandedRows={expandedRows}
        onRowToggle={(e) => {
          console.log(e)
          setExpandedRows(e.data)
        }}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="token"
        header={header}
        // tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />

        <Column
          field="title"
          header="Tiêu đề"
          sortable
          body={titleBodyTemplate}
        />

        <Column
          field="date"
          header="Ngày điểm danh"
          sortable
          body={dateCreateBodyTemplate}
        />

        <Column
          field="summary"
          header="Sỉ số"
          sortable
          body={summaryBodyTemplate}
        />
      </DataTable>
    </div>
  );
}
