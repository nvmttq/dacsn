import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

import { ParticipantsDataTableService } from "./service/ParticipantsDataTableService";
import * as constant from "../constant.js";

export default function LazyLoadDemo() {
  const ref = useRef("");
  const { courseToken } = useParams();
  const [showDivGroupModal, setShowDivGroupModal] = useState(false);
  const [loadingDivGroup, setLoadingDivGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [participants, setParticipants] = useState(null);
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
      role: { value: "", matchMode: "contains" },
      email: { value: "", matchMode: "contains" },
    },
  });

  let networkTimeout = null;

  useEffect(() => {
    loadGroupOfCourse();
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    //imitate delay of a backend call
    networkTimeout = setTimeout(() => {
      ParticipantsDataTableService.getParticipants({
        lazyEvent: JSON.stringify(lazyState),
        courseToken,
      }).then((data) => {
        console.log(data);
        setTotalRecords(data.length);
        setParticipants(data);
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
        courseToken,
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
      ParticipantsDataTableService.getParticipants({
        lazyEvent: JSON.stringify(lazyState),
        courseToken,
      }).then((data) => {
        setSelectAll(true);
        setSelectedParticipants(data);
      });
    } else {
      setSelectAll(false);
      setSelectedParticipants([]);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <i className="pi pi-trash" onClick={console.log(123)}></i>
        <i className="pi pi-trash"></i>
      </div>
    );
  };

  const fullNameBodyTemplate = (rowData) => {
    return <span>{rowData.nameDisplay}</span>;
  };

  const groupBodyTemplate = (rowData) => {
    let idGroup = -1;
    const username = rowData.userID;

    groups.forEach( (g, i) => {
      if(idGroup !== -1) return;
      g.participants.forEach(p => {
        if(p.userID === username) {
          idGroup = i+1;
          return;
        }
      })
    })
    return <span>{idGroup === -1 ? "Chưa có nhóm" : `Nhóm ${idGroup}`}</span>;
  };

  const roleBodyTemplate = (rowData) => {
    const getRole = () => {
      if (rowData.isTeacher) return "Giảng Viên";
      if (rowData.isTeachingAssitant) return "Trợ Giảng";
      return "Sinh Viên";
    };
    return <span>{getRole()}</span>;
  };
  const actionsDropdown = [{ name: "Chia nhóm", code: "CN" }];
  const handleDivGroup = async () => {
    setLoadingDivGroup(true);
    const numberStudentOfGroup = ref.current.value;
    await setTimeout(() => {
      fetch(`${constant.URL_API}/courses/div-groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseToken,
          numberStudentOfGroup,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoadingDivGroup(false);
          setShowDivGroupModal(false);
          loadGroupOfCourse();
        })
        .catch((err) => console.log(err));
    }, 2000);
  };
  const onChangeActionDropdown = (e) => {
    if (e.value.code === "CN") {
      setShowDivGroupModal(true);
    }
  };
  const DivGroupModal = () => {
    return (
      <Dialog
        header="CHIA NHÓM"
        visible={showDivGroupModal}
        className="w-4/5"
        onHide={() => setShowDivGroupModal(false)}
      >
        <div>
          <Button
            label="Xác nhận chia nhóm"
            icon="pi pi-check"
            loading={loadingDivGroup}
            onClick={handleDivGroup}
            className="mb-5 bg-green-400"
          />

          <div className="flex-auto">
            <label htmlFor="minmax-buttons" className="font-bold block mb-2">
              Số thành viên mỗi nhóm
            </label>
            <InputNumber
              ref={ref}
              inputId="NumberOfStudents"
              value={2}
              onValueChange={(e) => {
                ref.current.value = e.value;
                console.log(ref);
              }}
              mode="decimal"
              showButtons
              min={2}
              max={15}
              style={{ color: "black !important" }}
            />
          </div>
        </div>
      </Dialog>
    );
  };
  return (
    <div className="card flex flex-col">
      <div className="dropdown-action">
        <Dropdown
          onChange={onChangeActionDropdown}
          options={actionsDropdown}
          optionLabel="name"
          placeholder="Hành động"
          className="md:w-14rem float-right my-3"
        />
        {showDivGroupModal && <DivGroupModal />}
      </div>
      <DataTable
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
        tableStyle={{ minWidth: "75rem" }}
        selection={selectedParticipants}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column
          field="mssv"
          header="MSSV"
          body={"2124802010126"}
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
          field="email"
          sortable
          body={"2124802010126@student.tdmu.edu.vn"}
          filter
          header="Email"
          filterField="email"
          filterPlaceholder="Search"
        />
        <Column
          field="role"
          header="Vai trò"
          body={roleBodyTemplate}
          filter
          filterField="role"
          filterPlaceholder="Search"
        />
        <Column
          field="group"
          header="Nhóm"
          body={groupBodyTemplate}
          filter
          filterField="group"
          filterPlaceholder="Search"
        />

        <Column field="action" header="Thao tác" body={actionBodyTemplate} />
      </DataTable>
    </div>
  );
}
