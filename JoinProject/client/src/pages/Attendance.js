import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";

import moment from "moment";

import * as constant from "../constant.js";
export default function Attendance({ courseToken }) {
  const [attendances, setAttendances] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmitAttend, setLoadingSubmitAttend] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${constant.URL_API}/attendances/${courseToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAttendances(data.attendances);
        setSelectedParticipants(data.selectedUsers)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [courseToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Expanded",
      detail: event.data.title,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Product Collapsed",
      detail: event.data.title,
      life: 3000,
    });
  };

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
          footer={footer}
          lazy
          dataKey="user.username"
          paginator
          rows={10}
          tableStyle={{ minWidth: "55rem" }}
          selection={selectedParticipants} onSelectionChange={(e) => {
            console.log(e.value);
            setSelectedParticipants(e.value)
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
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
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

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Mở rộng tất cả" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Thu nhỏ tất cả"
        onClick={collapseAll}
        text
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
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="title"
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
