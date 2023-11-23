import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Tree } from "primereact/tree";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { Link } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Editor } from "primereact/editor";
import "primeicons/primeicons.css";

import * as constant from "../constant.js";
import { InputText } from "primereact/inputtext";

const shortid = require("shortid");

const DialogRestoreContent = ({
  visibleDialog,
  setVisibleDialog,
  user,
  courseInformation,
  fetchContentCourse,
  nodeTemplate,
}) => {
  const [repositories, setRepositories] = useState([]);
  const [sub, setSub] = useState({});
  console.log("USER DIALONG RÉTORE", user);
  useEffect(() => {
    setRepositories(user.repositories.filter((r) => r.id === "LND"));
  }, [user.repositories]);

  const acceptRestoreContentCourse = async (sub) => {
    await axios
      .put(`${constant.URL_API}/update-course`, {
        token: courseInformation.token,
        contentCourse: sub.contentCourse,
      })
      .then((res) => {
        console.log(res);
        // setCourseInformation(res.data.courseUpdate)
        fetchContentCourse();
      })
      .catch((err) => console.log(err));
  };

  const confirm1 = (sub) => {
    console.log(sub);
    confirmDialog({
      message:
        "Khi tải lên nội dung khác nội dung cũ sẽ bị ghi đè. Bạn có xác nhận tải lên nội dung này?",
      header: "Thông báo ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        acceptRestoreContentCourse(sub);
        setVisibleDialog("?");
      },
      acceptLabel: "Xác nhận",
      rejectLabel: "Từ chối",
    });
  };
  return (
    <Dialog
      header="Các nội dung hiện có"
      visible={visibleDialog === "TND"}
      style={{ width: "50vw" }}
      onHide={() => setVisibleDialog("?")}
    >
      <Dialog
        header="Xem trước nội dung"
        visible={!(Object.keys(sub).length === 0 && sub.constructor === Object)}
        style={{ width: "50vw" }}
        onHide={() => setSub({})}
      >
        <Tree
          value={sub.contentCourse}
          className="w-full md:w-30rem"
          nodeTemplate={nodeTemplate}
        />
      </Dialog>

      <ConfirmDialog />
      {repositories !== null &&
        repositories.length > 0 &&
        repositories[0].data.map((sub, i) => (
          <div key={i} className="flex justify-between items-center ml-4">
            <span className="sub-name">{sub.title}</span>
            <div className="action-sub-restore">
              <Button className="underline" link onClick={() => setSub(sub)}>
                Xem
              </Button>

              <Button className="underline" link onClick={() => confirm1(sub)}>
                Sử dụng
              </Button>
            </div>
          </div>
        ))}
    </Dialog>
  );
};
export default function Contents({ isPermissionOnCourse }) {
  const toast = useRef(null);
  const [visibleDialog, setVisibleDialog] = useState("?");
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  console.log(user);
  const [currentKeySelect, setCurrentKeySelect] = useState("");
  const filesRefEdit = useRef({});
  const examToken = "examToken1";

  const toast_success = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

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
        if (tree[index].type === "FILE") {
          tree[index].label = newValue.label;
          tree[index].base64 = newValue.base64;
        } else {
          tree[index].label = newValue;
        }
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
          icon: "pi pi-book mr-5",
          type: "TN",
          children: [],
        });
      } else {
        addChildrenExamFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const addChildrenAssignFromKey = ({ tree, key }) => {
    if (!tree) return;
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        tree[i].children.push({
          key: shortid.generate(),
          label: "",
          icon: "pi pi-folder-open mr-5",
          type: "BT",
          children: [],
        });
      } else {
        addChildrenAssignFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const addChildrenFileFromKey = ({ tree, key }) => {
    if (!tree) return;
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        tree[i].children.push({
          key: shortid.generate(),
          label: "",
          icon: "pi pi-file mr-5",
          type: "FILE",
          base64: "?",
          children: [],
        });
      } else {
        addChildrenFileFromKey({ tree: tree[i].children, key: key });
      }
    }
  };

  const nodeTemplate = (node, options) => {
    let typeLabel;
    if (node.type === "BT") {
      typeLabel = (
        <div className="flex items-center">
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
          {/* <i
            className="pi pi-book mr-5"
            style={{ fontSize: "2rem", color: "#4338CA" }}
          ></i> */}
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
    } else if (node.type === "FILE") {
      const myUploader = async (e) => {
        console.log(e);
        const convertBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
              resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
              reject(error);
            };
          });
        };

        const a = document.querySelector(".p-fileupload")[0];
        console.log(a);

        const b = await convertBase64(e.files[0]);
        filesRefEdit.current[node.key] = b;
        console.log(e, e.files, b);
        console.log(filesRefEdit);
        toast_success("success", "Thông báo", "Tải file thành công");
      };
      typeLabel = (
        <div>
          <div className="name-file flex items-center">
            <span>Tên file: </span>
            <InputTextarea
              autoResize
              cols={100}
              rows={1}
              defaultValue={node.label}
              onChange={(e) => {
                solveContent({
                  newValue: {
                    label: e.target.value,
                    base64: filesRefEdit.current[node.key],
                  },
                  key: node.key,
                });
                setTreeContentEdit(
                  treeContentEdit.filter((x) => x.key !== "?????")
                );
              }}
            />
          </div>
          <FileUpload
            mode="basic"
            name="demo[]"
            accept="*"
            auto
            customUpload
            uploadHandler={myUploader}
            pt={{
              chooseButton: {
                label: "Chọn File",
                className: "!p-0",
              },
            }}
          />
        </div>
      );
    } else {
      typeLabel = (
        <Editor
          value={node.label}
          onTextChange={(e) => {
            solveContent({ newValue: e.htmlValue, key: node.key });
            setTreeContentEdit(
              treeContentEdit.filter((x) => x.key !== "?????")
            );
          }}
        />
      );
    }

    let label = (
      <div className="flex mb-5">
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
    } else if (node.type === "FILE") {
      label = (
        <a
          href={node.base64}
          download={node.label}
          style={{ color: "#4338CA" }}
          className="hover:underline hover:decoration-4 block"
        >
          {node.label}
        </a>

        // <form action={}>
        //   <Button icon="pi pi-book" label={node.label} type="submit" link/>;
        // </form>
      );
    } else {
      label = <div dangerouslySetInnerHTML={{ __html: node.label }}></div>;
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
  }, [currentCourses, user]);

  const actions = [
    { name: "Chỉnh sửa nội dung", code: "CSND" },
    { name: "Lưu nội dung", code: "LND" },
    { name: "Tải lên nội dung khóa học", code: "TND" },
  ];
  const solveAction = (e) => {
    setVisibleDialog(e.value.code);
  };

  const acceptSaveContentCourse = async () => {
    const name = document.getElementById("accept-save-content").value;
    await fetch(`${constant.URL_API}/users/save-content-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        courseInformation,
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setVisibleDialog("?");
        fetchContentCourse();
      });

    toast.current.show({
      severity: "success",
      summary: "Thông báo",
      detail: "Lưu thành công",
      life: 3000,
    });
  };

  const cancelModalEditContent = () => {
    fetchContentCourse();
    setVisibleDialog(0);
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
      key: shortid.generate(),
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
              icon="pi pi-folder-open"
              text
              onClick={() => {
                addChildrenAssignFromKey({
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
              label="File"
              icon="pi pi-folder-open"
              text
              onClick={() => {
                addChildrenFileFromKey({
                  tree: treeContentEdit,
                  key: currentKeySelect,
                });
                setTreeContentEdit(
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
        visible={visibleDialog === "CSND"}
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
            onDragDrop={(e) => {
              console.log(e.value);
              setTreeContentEdit(e.value);
            }}
            dragdropScope="demo"
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
        visible={visibleDialog === "LND"}
        onHide={() => setVisibleDialog("?")}
        pt={{
          content: {
            className: "w-full",
          },
          message: {
            className: "w-full",
          },
          acceptButton: {
            label: "Xác nhận",
          },
          rejectButton: {
            label: "Từ chối",
          },
        }}
        message={
          <div className="flex flex-col gap-y-2 w-full">
            <span>Xác nhận lưu ? </span>
            <InputText
              autoFocus={true}
              className="w-full"
              id="accept-save-content"
              placeholder="Nhập tên cho nội dung lưu .... "
            ></InputText>
          </div>
        }
        header="Bạn có chắc muốn lưu không ? "
        icon="pi pi-exclamation-triangle"
        className="w-3/6"
        accept={acceptSaveContentCourse}
      ></ConfirmDialog>

      <DialogRestoreContent
        visibleDialog={visibleDialog}
        setVisibleDialog={setVisibleDialog}
        user={user}
        courseInformation={courseInformation}
        setCourseInformation={setCourseInformation}
        fetchContentCourse={fetchContentCourse}
        nodeTemplate={nodeTemplateCourseInformation}
      ></DialogRestoreContent>

      <div className="w-auto mt-4">
        <div className="absolute end-5">
          <Dropdown
            onChange={solveAction}
            options={actions}
            optionLabel="name"
            placeholder="Hành động"
            className="w-full md:w-14rem"
            style={{
              display: `${isPermissionOnCourse ? "" : "none"}`,
            }}
          />
        </div>
        <div className=" w-4/5 bg-white rounded-[15px]">
          <Tree
            value={courseInformation.contentCourse}
            className="w-full md:w-30rem"
            nodeTemplate={nodeTemplateCourseInformation}
            pt={{
              nodeIcon: {
                className: "!text-icon-color text-xl",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
