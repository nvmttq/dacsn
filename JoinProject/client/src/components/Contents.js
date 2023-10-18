import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Tree } from "primereact/tree";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import axios from "axios";

export default function Contents() {
  const toast = useRef(null);

  const showSuccess = () => {
      toast.current.show({severity:'success', summary: 'Success', detail:'Cập nhật nội dung thành công!!', life: 3000});
  }

  const [loadingSaveChanges, setLoadingSaveChanges] = useState(false);
  const [checkUpdateContent, setCheckUpdateContent] = useState(false);
  const editContent = ({ tree, index, key, newValue }) => {
    if (!checkUpdateContent && index < tree.length) {
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
    editContent({
      tree: treeContentEdit,
      index: 0,
      key: key,
      newValue: newValue,
    });
  };

  const nodeTemplate = (node, options) => {
    let label = (
      <InputText
        defaultValue={node.label}
        onChange={(e) => {
          setCheckUpdateContent(false);
          solveContent({ newValue: e.target.value, key: node.key });
        }}
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
          setLoadingSaveChanges(false);
          showSuccess();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const SaveChangeButton = () => {
    setLoadingSaveChanges(true);
    axios
      .put("http://localhost:3002/update-course", {
        token: currentCourses,
        contentCourse: treeContentEdit,
      })
      .then(function (response) {
        fetchContentCourse();
      })
      .catch(function (error) {
        console.log(error);
      });
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
            <Button
              label="Lưu thay đổi"
              icon="pi pi-check"
              loading={loadingSaveChanges}
              onClick={SaveChangeButton}
              className="mb-5 bg-green-400"
            />
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
