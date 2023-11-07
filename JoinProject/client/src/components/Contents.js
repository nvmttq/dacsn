import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Tree } from "primereact/tree";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";

import * as constant from "../constant.js";

const shortid = require("shortid");

export default function Contents() {
  const toast = useRef(null);
  const [visibleConfirmSave, setVisibleConfirmSave] = useState(false);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [currentKeySelect, setCurrentKeySelect] = useState("");

  const examToken = "examToken1";

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

  const deleteContentByKey = ({ tree, index, key }) => {
    if (index < tree.length && tree[index].children) {
      if (tree[index].children.filter((x) => x.key === key).length > 0) {
        tree[index].children = tree[index].children.filter(
          (x) => x.key !== key
        );
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
  };
  const addChildrenContentFromKey = ({ tree, key }) => {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        tree[i].children.push({
          key: shortid.generate(),
          label: "",
          type: "VB",
          children: [],
        });
      } else {
        addChildrenContentFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const addChildrenExamFromKey = ({ tree, key }) => {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        tree[i].children.push({
          key: shortid.generate(),
          label: "",
          type: "TN",
          children: [],
        });
      } else {
        addChildrenExamFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const addChildrenAssignFromKey = ({ tree, key }) => {
    if(!tree) return;
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        tree[i].children.push({
          key: shortid.generate(),
          label: "",
          type: "BT",
          children: [],
        });
      } else {
        addChildrenAssignFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const nodeTemplate = (node, options) => {
    let typeLabel;
    if (node.type === "BT") {
      typeLabel = (
        <div className="flex items-center">
          <i
            className="pi pi-book mr-5"
            style={{ fontSize: "2rem", color: "#4338CA" }}
          ></i>
          <InputTextarea
            autoResize
            cols={100}
            rows={1}
            defaultValue={node.label}
            onChange={(e) => {
              solveContent({ newValue: e.target.value, key: node.key });
              setTreeContentEdit(
                treeContentEdit.filter((x) => x.key !== "?????")
              );
            }}
          />
        </div>
      );
    } else if (node.type === "TN") {
      typeLabel = (
        <div className="flex items-center">
          <i
            className="pi pi-book mr-5"
            style={{ fontSize: "2rem", color: "#4338CA" }}
          ></i>
          <InputTextarea
            autoResize
            cols={100}
            rows={1}
            defaultValue={node.label}
            onChange={(e) => {
              solveContent({ newValue: e.target.value, key: node.key });
              setTreeContentEdit(
                treeContentEdit.filter((x) => x.key !== "?????")
              );
            }}
          />
        </div>
      );
    } else {
      typeLabel = (
        <InputTextarea
          autoResize
          cols={100}
          rows={1}
          defaultValue={node.label}
          onChange={(e) => {
            solveContent({ newValue: e.target.value, key: node.key });
            setTreeContentEdit(
              treeContentEdit.filter((x) => x.key !== "?????")
            );
          }}
        />
      );
    }

    let label = (
      <div className="flex">
        {typeLabel}
        <Button
          icon="pi pi-arrow-down-right"
          className="ml-3"
          title="Thêm tài nguyên"
          severity="info"
          onClick={() => {
            setCurrentKeySelect(node.key);
            showModalAddChildrenContent();
          }}
        />
        <Button
          icon="pi pi-trash"
          className="ml-3"
          title="Xóa nội dung này"
          severity="danger"
          onClick={() => {
            if (treeContentEdit.filter((x) => x.key === node.key).length > 0) {
              setTreeContentEdit(
                treeContentEdit.filter((x) => x.key !== node.key)
              );
            } else {
              deleteContentByKey({
                tree: treeContentEdit,
                index: 0,
                key: node.key,
              });
              setTreeContentEdit(
                treeContentEdit.filter((x) => x.key !== "???")
              );
            }
          }}
        />
      </div>
    );

    return <span className={options.className}>{label}</span>;
  };

  const nodeTemplateCourseInformation = (node, options) => {
    let label;
    if (node.type === "TN") {
      label = (
        <div className="flex items-center">
          <i className="pi pi-book mr-3" style={{ color: "#4338CA" }}></i>
          <Link
            to={"/exam/" + examToken}
            style={{ color: "#4338CA" }}
            className="hover:underline hover:decoration-4"
          >
            {node.label}
          </Link>
        </div>

        // <form action={}>
        //   <Button icon="pi pi-book" label={node.label} type="submit" link/>;
        // </form>
      );
    } else if (node.type === "BT") {
      label = (
        <div className="flex items-center">
          <i className="pi pi-book mr-3" style={{ color: "#4338CA" }}></i>
          <Link
            to={"/assignments/assToken2"}
            style={{ color: "#4338CA" }}
            className="hover:underline hover:decoration-4"
          >
            {node.label}
          </Link>
        </div>

        // <form action={}>
        //   <Button icon="pi pi-book" label={node.label} type="submit" link/>;
        // </form>
      );
    } else {
      label = node.label;
    }
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

  const actions = [
    { name: "Chỉnh sửa nội dung", code: "CSND" },
    { name: "Lưu nội dung", code: "LND" },
  ];
  const solveAction = (e) => {
    if (e.value.code === "CSND") {
      showModalEditContent();
    } else if (e.value.code === "LND") {
      showModalSaveContent();
    }
  };
  const [editContentModal, setEditContentModal] = useState(false);
  const showModalEditContent = () => {
    setEditContentModal(true);
  };

  const showModalSaveContent = () => {
    setVisibleConfirmSave(true);
  };

  const acceptSaveContentCourse = async () => {
    await fetch(`${constant.URL_API}/users/save-content-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        courseInformation,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    toast.current.show({
      severity: "success",
      summary: "Thông báo",
      detail: "Lưu thành công",
      life: 3000,
    });
  };

  const cancelModalEditContent = () => {
    fetchContentCourse();
    setEditContentModal(false);
  };

  const [addChildrenContentModal, setAddChildrenContentModal] = useState(false);
  const showModalAddChildrenContent = () => {
    setAddChildrenContentModal(true);
  };
  const cancelModalAddChildrenContent = () => {
    setAddChildrenContentModal(false);
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

  const fixTreeContent = ({ tree }) => {
    var i = 0;
    while (i < tree.length) {
      if (tree[i].label === "") {
        tree.splice(i, 1);
      } else {
        i++;
      }
    }
    for (var j = 0; j < tree.length; j++) {
      fixTreeContent({ tree: tree[j].children });
    }
  };

  const SaveChangeButton = () => {
    setLoadingSaveChanges(true);
    axios
      .put("http://localhost:3002/update-course", {
        token: currentCourses,
        contentCourse: treeContentEdit,
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
      type: "VB",
    });
    setTreeContentEdit(arr);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={addChildrenContentModal}
        className="w-2/3"
        onHide={cancelModalAddChildrenContent}
      >
        <Fieldset legend="Thêm tài nguyên">
          <div className="flex">
            <Button
              label="Văn bản"
              icon="pi pi-clone"
              text
              onClick={() => {
                addChildrenContentFromKey({
                  tree: treeContentEdit,
                  key: currentKeySelect,
                });
                setTreeContentEdit(
                  treeContentEdit.filter((x) => x.key !== "?????")
                );
                cancelModalAddChildrenContent();
              }}
            />
            <Button
              label="Trắc nghiệm"
              icon="pi pi-book"
              text
              onClick={() => {
                addChildrenExamFromKey({
                  tree: treeContentEdit,
                  key: currentKeySelect,
                });
                setTreeContentEdit(
                  treeContentEdit.filter((x) => x.key !== "?????")
                );
                cancelModalAddChildrenContent();
              }}
            />

            <Button
              label="Bài tập"
              icon="pi pi-book"
              text
              onClick={() => {
                addChildrenAssignFromKey({
                  tree: treeContentEdit,
                  key: currentKeySelect,
                });
                addChildrenAssignFromKey(
                  treeContentEdit.filter((x) => x.key !== "?????")
                );
                cancelModalAddChildrenContent();
              }}
            />
          </div>
        </Fieldset>
      </Dialog>

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
              onClick={() => {
                fixTreeContent({ tree: treeContentEdit });
                setTreeContentEdit(
                  treeContentEdit.filter((x) => x.key !== "?????")
                );
                SaveChangeButton();
              }}
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
              label="Thêm mục mới"
              onClick={AddToTreeContent}
              className="mt-5"
              severity="info"
            />
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        visible={visibleConfirmSave}
        onHide={() => setVisibleConfirmSave(false)}
        message="Xác nhận lưu?"
        header="Bạn có chắc muốn lưu không ? "
        icon="pi pi-exclamation-triangle"
        accept={acceptSaveContentCourse}
      />

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
            nodeTemplate={nodeTemplateCourseInformation}
          />
        </div>
      </div>
    </>
  );
}
