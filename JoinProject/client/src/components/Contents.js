import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Tree } from "primereact/tree";
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function Contents() {
  const [checkUpdateContent, setCheckUpdateContent] = useState(false);
  const editContent = ({ tree, index, key, newValue }) => {
    if (!checkUpdateContent) {
      if (tree[index].key === key) {
        setCheckUpdateContent(true);
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
        if (!checkUpdateContent) {
          editContent({
            tree: tree,
            index: index + 1,
            key: key,
            newValue: newValue,
          });
        }
      }
    }
  };

  const solveContent = ({ newValue, key }) => {
    setCheckUpdateContent(false);
    let treeContentEditCopy = treeContentEdit;
    editContent({
      tree: treeContentEditCopy,
      index: 0,
      key: key,
      newValue: newValue,
    });
    setTreeContentEdit(treeContentEditCopy);
  };

  const nodeTemplate = (node, options) => {
    let label = (
      <InputText
        value={node.label}
        onChange={(e) =>
          solveContent({ newValue: e.target.value, key: node.key })
        }
      />
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
        setCourseInformation(course);
        setTreeContentEdit(course.contentCourse);
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
    setEditContentModal(false);
  };

  return (
    <>
      <Dialog
        header="CHỈNH SỬA NỘI DUNG"
        visible={editContentModal}
        className="w-4/5"
        onHide={cancelModalEditContent}
      >
        <div className="card flex justify-content-center">
          <Tree
            value={treeContentEdit}
            nodeTemplate={nodeTemplate}
            className="w-full md:w-30rem"
          />
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
