import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Tree } from "primereact/tree";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Contents() {
  const toast = useRef(null);

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Cập nhật nội dung thành công!!",
      life: 3000,
    });
  };

  const [loadingSaveChanges, setLoadingSaveChanges] = useState(false);
  const editContent = ({ tree, index, key, newValue }) => {
    if (index < tree.length) {
      if (tree[index].key === key) {
        tree[index].label = newValue;
      } else {
        if (tree[index].children) {
          editContent({
            tree: tree[index].children,
            index: 0,
            key: key,
            newValue: newValue,
          });
        }
        editContent({
          tree: tree,
          index: index + 1,
          key: key,
          newValue: newValue,
        });
      }
    }
  };

  const solveContent = ({ newValue, key }) => {
    editContent({
      tree: treeContentEdit,
      index: 0,
      key: key,
      newValue: newValue,
    });
  };

  const deleteContentByKey = ({tree, index, key}) => {
    if (index < tree.length && tree[index].children) {
      if (tree[index].children.filter(x => x.key === key).length > 0) {
        tree[index].children = tree[index].children.filter(x => x.key !== key);
      } else {
        if (tree[index].children) {
          deleteContentByKey({
            tree: tree[index].children,
            index: 0,
            key: key,
          });
        }
        deleteContentByKey({
          tree: tree,
          index: index + 1,
          key: key,
        });
      }
    }
  }

  const nodeTemplate = (node, options) => {
    let label = (
      <div className="flex">
        <InputTextarea
          autoResize
          cols={100}
          rows={1}
          defaultValue={node.label}
          onChange={(e) => {
            solveContent({ newValue: e.target.value, key: node.key });
          }}
        />
        <Button
          icon="pi pi-arrow-down-right"
          className="ml-3"
          title="Thêm nội dung con"
          severity="info"
        />
        <Button
          icon="pi pi-trash"
          className="ml-3"
          title="Xóa nội dung này"
          severity="danger"
          onClick={() => {
            if (treeContentEdit.filter(x => x.key === node.key).length > 0) {
              setTreeContentEdit(treeContentEdit.filter(x => x.key !== node.key))
            } else {
              deleteContentByKey({tree: treeContentEdit, index: 0, key: node.key})
            }
          }}
        />
      </div>
    );

    return <span className={options.className}>{label}</span>;
  };

  const currentCourses = localStorage.getItem("currentCourses")
    ? JSON.parse(localStorage.getItem("currentCourses"))
    : null;
  const [courseInformation, setCourseInformation] = useState({});
  const [treeContentEdit, setTreeContentEdit] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3002/get-course", {})
      .then(function (response) {
        let course = response.data.dataCourse.filter(
          (x) => x.token === currentCourses
        )[0];
        if (course) {
          setCourseInformation(course);
          setTreeContentEdit(course.contentCourse);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [currentCourses]);

  const actions = [{ name: "Chỉnh sửa nội dung", code: "CSND" }];
  const solveAction = (e) => {
    if (e.value.code === "CSND") {
      showModalEditContent();
    }
  };
  const [editContentModal, setEditContentModal] = useState(false);
  const showModalEditContent = () => {
    setEditContentModal(true);
  };
  const cancelModalEditContent = () => {
    fetchContentCourse();
    setEditContentModal(false);
  };

  const fetchContentCourse = () => {
    axios
      .get("http://localhost:3002/get-course", {})
      .then(function (response) {
        let course = response.data.dataCourse.filter(
          (x) => x.token === currentCourses
        )[0];
        if (course) {
          setCourseInformation(course);
          setTreeContentEdit(course.contentCourse);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const SaveChangeButton = () => {
    setLoadingSaveChanges(true);
    axios
      .put("http://localhost:3002/update-course", {
        token: currentCourses,
        contentCourse: treeContentEdit.filter((x) => x.label !== ""),
      })
      .then(function (response) {
        fetchContentCourse();
        setLoadingSaveChanges(false);
        showSuccess();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const AddToTreeContent = () => {
    const arr = [];
    for (var i = 0; i < treeContentEdit.length; i++) {
      arr.push(treeContentEdit[i]);
    }
    arr.push({
      key: treeContentEdit.length.toString(),
      label: "",
      children: [],
    });
    setTreeContentEdit(arr);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="CHỈNH SỬA NỘI DUNG"
        visible={editContentModal}
        className="w-4/5"
        onHide={cancelModalEditContent}
      >
        <div>
          <div className="flex">
            <Button
              label="Lưu thay đổi"
              icon="pi pi-check"
              loading={loadingSaveChanges}
              onClick={SaveChangeButton}
              className="mb-5"
              severity="success"
            />
          </div>
          <Tree
            value={treeContentEdit}
            nodeTemplate={nodeTemplate}
            className="w-full md:w-30rem"
          />
          <div className="flex">
            <Button
              label="Thêm tài nguyên"
              onClick={AddToTreeContent}
              className="mt-5"
              severity="info"
            />
          </div>
        </div>
      </Dialog>
      <div className="w-auto mt-4 ml-10">
        <div className="absolute end-5">
          <Dropdown
            onChange={solveAction}
            options={actions}
            optionLabel="name"
            placeholder="Hành động"
            className="w-full md:w-14rem"
          />
        </div>
        <div className="overflow-y-auto h-[500px] w-4/5 bg-white rounded-[15px]">
          <Tree
            value={courseInformation.contentCourse}
            className="w-full md:w-30rem"
          />
        </div>
      </div>
    </>
  );
}
