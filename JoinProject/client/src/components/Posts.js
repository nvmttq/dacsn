import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { TabMenu } from "primereact/tabmenu";
import { Badge } from "primereact/badge";
import "primeicons/primeicons.css";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";


import * as constant from "../constant.js";
export default function Posts({isPermissionOnCourse}) {
  const [replyChange, setReplyChange] = useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { courseToken } = useParams();
  const toast = useRef(null);
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Đăng bài thành công",
      life: 3000,
    });
  };
  const showSuccessDeletePost = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Xóa bài thành công",
      life: 3000,
    });
  };
  const showSuccessEditPost = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Chỉnh sửa bài thành công",
      life: 3000,
    });
  };
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Đăng bài thất bại",
      life: 3000,
    });
  };
  const showWarningEmpty = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Không được bỏ trống tiêu đề hoặc nội dung!!",
      life: 3000,
    });
  };

  const [checkNotification, setCheckNotification] = useState(false);

  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [contentCommentPost, setContentCommentPost] = useState("");

  const [idDetailPost, setIdDetailPost] = useState("");
  const [titleDetailPost, setTitleDetailPost] = useState("");
  const [contentDetailPost, setContentDetailPost] = useState("");
  const [authorDetailPost, setAuthorDetailPost] = useState("");
  const [nameAuthorDetailPost, setNameAuthorDetailPost] = useState("");
  const [createdAtDetailPost, setCreatedAtDetailPost] = useState("");
  const [checkBookmark, setCheckBookmark] = useState(false);
  const [commentPost, setCommentPost] = useState([]);
  const [listLikePost, setListLikePost] = useState([]);
  const [numberOfUnseenNotification, setNumberOfUnseenNotification] =
    useState(0);
  const [checkLike, setCheckLike] = useState(false);

  const [listPosts, setListPosts] = useState([]);
  const [listNotificationPosts, setListNotificationPosts] = useState([]);
  const [tempPost, setTempPost] = useState([]);

  const author = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
  const nameUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  const setNewItems = ({ num }) => {
    setItems([
      { label: "Học tập" },
      {
        label: (
          <div>
            Thông báo {num > 0 && <Badge value={num} severity="danger"></Badge>}
          </div>
        ),
      },
    ]);
  };

  const fetchNotification = ({ list }) => {
    console.log(list);
    list.forEach((element) => {
      axios
        .put("http://localhost:3002/posts/notification", {
          id: element._id,
          listUnseenUser: element.listUnseenUser,
        })
        .then(function (res) {})
        .catch(function (error) {
          console.log(error);
        });
    });
    setNewItems({ num: 0 });
  };

  const clearNotification = () => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        let arr = response.data.dataPosts.filter(
          (x) => x.idCourse === courseToken
        );
        arr.forEach((element) => {
          for (var i = 0; i < element.listUnseenUser.length; i++) {
            if (element.listUnseenUser[i].userID === user.username) {
              element.listUnseenUser.splice(i, 1);
              break;
            }
          }
        });
        fetchNotification({ list: arr });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        let arr = response.data.dataPosts.filter(
          (x) => x.idCourse === courseToken
        );
        let num = 0;
        arr.forEach((element) => {
          if (
            element.listUnseenUser.filter((x) => x.userID === user.username)
              .length > 0
          ) {
            num++;
          }
        });
        setListPosts(
          response.data.dataPosts
            .filter(
              (x) => x.idCourse === courseToken && x.notification === false
            )
            .reverse()
        );
        setListNotificationPosts(
          response.data.dataPosts
            .filter(
              (x) => x.idCourse === courseToken && x.notification === true
            )
            .reverse()
        );
        setNewItems({ num: num });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const fetchDataPosts = () => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        setListPosts(
          response.data.dataPosts
            .filter(
              (x) => x.idCourse === courseToken && x.notification === false
            )
            .reverse()
        );
        setListNotificationPosts(
          response.data.dataPosts
            .filter(
              (x) => x.idCourse === courseToken && x.notification === true
            )
            .reverse()
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  function compare(a, b) {
    if (a.like.length < b.like.length) return 1;
    if (a.like.length > b.like.length) return -1;

    return 0;
  }
  const fetchDataComment = ({ id }) => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        let post = response.data.dataPosts.filter((x) => x._id === id);
        setIdDetailPost(post[0]._id);
        setTitleDetailPost(post[0].title);
        setContentDetailPost(post[0].content);
        setCreatedAtDetailPost(post[0].createDate);
        setCheckBookmark(post[0].bookmark);
        setAuthorDetailPost(post[0].author);
        setNameAuthorDetailPost(post[0].nameAuthor);
        setListLikePost(post[0].like);
        let arr = post[0].like.filter((x) => x === author);
        if (arr.length > 0) {
          setCheckLike(true);
        } else {
          setCheckLike(false);
        }
        axios
          .get("http://localhost:3002/comments", {})
          .then(function (res) {
            let comment = res.data.dataComments.filter(
              (x) => x.idPost === post[0]._id
            );
            comment.sort(compare);
            setCommentPost(comment);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const AddPosts = ({ check }) => {
    if (title === "" || content === "") {
      showWarningEmpty();
      return;
    }
    if (check) {
      axios
        .get("http://localhost:3002/get-course", {})
        .then(function (response) {
          axios
            .post("http://localhost:3002/posts", {
              title: title,
              content: content,
              author: author,
              nameAuthor: nameUser,
              notification: check,
              createDate: moment().format("DD-MM-YYYY HH:mm"),
              listUnseenUser: response.data.dataCourse
                .filter((x) => x.token === courseToken)[0]
                .participants.filter((x) => x.userID !== user.username),
              idCourse: courseToken,
            })
            .then(function (response) {
              setTitle("");
              setContent("");
              fetchDataPosts();
              showSuccess();
            })
            .catch(function (error) {
              console.log(error);
              showError();
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post("http://localhost:3002/posts", {
          title: title,
          content: content,
          author: author,
          nameAuthor: nameUser,
          notification: check,
          createDate: moment().format("DD-MM-YYYY HH:mm"),
          listUnseenUser: [],
          idCourse: courseToken,
        })
        .then(function (response) {
          setTitle("");
          setContent("");
          fetchDataPosts();
          showSuccess();
        })
        .catch(function (error) {
          console.log(error);
          showError();
        });
    }
  };

  const AddComment = () => {
    if (contentCommentPost === "") {
      return;
    }
    axios
      .post("http://localhost:3002/comments", {
        idPost: idDetailPost,
        idUser: author,
        nameUser: nameUser,
        imagePath: "",
        content: contentCommentPost,
        createDate: moment().format("DD-MM-YYYY HH:mm"),
        reply: [],
      })
      .then(function (response) {
        setContentCommentPost("");
        fetchDataComment({ id: idDetailPost });
        console.log(commentPost);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const AddReply = ({ id }) => {
    if (!replyChange.hasOwnProperty(id) || replyChange[id] === "") {
      return;
    }
    axios
      .get("http://localhost:3002/comments", {})
      .then(function (response) {
        let check = response.data.dataComments.filter((x) => x._id === id)[0]
          .reply;
        const reply = {
          idUser: author,
          nameUser: nameUser,
          createDate: moment().format("DD-MM-YYYY HH:mm"),
          content: replyChange[id],
        };
        check.push(reply);
        axios
          .put("http://localhost:3002/comments", {
            id: id,
            reply: check,
          })
          .then(function (res) {
            setReplyChange({
              ...replyChange,
              [id]: "",
            });
            fetchDataComment({ id: idDetailPost });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const addLike = () => {
    let arr = listLikePost;
    arr.push(author);
    setListLikePost(arr);
    axios
      .put("http://localhost:3002/posts", {
        id: idDetailPost,
        like: arr,
      })
      .then(function (response) {
        fetchDataComment({ id: idDetailPost });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const addLikeComment = ({ listLikeComment, idComment }) => {
    if (listLikeComment.filter((x) => x === author).length > 0) {
      return;
    }
    let arr = listLikeComment;
    arr.push(author);
    axios
      .put("http://localhost:3002/like-comments", {
        id: idComment,
        like: arr,
      })
      .then(function (response) {
        fetchDataComment({ id: idDetailPost });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const removeLikeComment = ({ listLikeComment, idComment }) => {
    let arr = listLikeComment;
    for (var i = 0; i < listLikeComment.length; i++) {
      if (listLikeComment[i] === author) {
        listLikeComment.splice(i, 1);
        break;
      }
    }
    axios
      .put("http://localhost:3002/like-comments", {
        id: idComment,
        like: arr,
      })
      .then(function (response) {
        fetchDataComment({ id: idDetailPost });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const removeLike = () => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        let check = response.data.dataPosts.filter(
          (x) => x._id === idDetailPost
        );
        let arr = check[0].like.filter((x) => x !== author);
        axios
          .put("http://localhost:3002/posts", {
            id: idDetailPost,
            like: arr,
          })
          .then(function (response) {
            fetchDataComment({ id: idDetailPost });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [postsModal, setPostModal] = useState(false);
  const showModalPosts = ({ id }) => {
    setPostModal(true);
    fetchDataComment({ id: id });
  };
  const cancelModal = () => {
    setPostModal(false);
    setCheckLike(false);
  };

  const [visible, setVisible] = useState(false);

  const [editPost, setEditPost] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);

  const DeletePost = () => {
    axios
      .put("http://localhost:3002/posts/delete-post", {
        _id: editId,
      })
      .then(function () {
        setVisible(false);
        showSuccessDeletePost();
        fetchDataPosts();
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const EditPost = () => {
    if (editPost === "" || editContent === "") {
      showWarningEmpty();
      return;
    }
    axios
      .put("http://localhost:3002/posts-edit", {
        _id: editId,
        title: editPost,
        content: editContent,
      })
      .then(function (response) {
        setVisible(false);
        showSuccessEditPost();
        fetchDataPosts();
        setEditContent("");
        setEditId(null);
        setEditPost("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const LoadContentPost = () => {
    if (editId !== null) {
      listPosts.map((item) => {
        if (item._id === editId) {
          setEditPost(item.title);
          setEditContent(item.content);
        }
      });
      // console.log(editId, editContent, editPost);
    }
  };

  return (
    <>
      <Dialog
        header="Chỉnh sửa bài viết"
        visible={visible}
        className="w-[900px] h-auto"
        onHide={() => {
          setVisible(false);
        }}
      >
        <div className="rounded-lg h-auto mt-5 ml-10 mr-10 bg-white">
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="px-4 py-2 bg-white rounded-t-lg">
              <InputText
                value={editPost}
                onChange={(e) => setEditPost(e.target.value)}
                className="w-full"
              />
              <InputTextarea
                id="comment"
                rows="4"
                className="w-full text-sm text-gray-900 bg-white border-0 focus:ring-0"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            <div className="flex items-center px-3 py-2 border-t">
              <Button
                label="Lưu thay đổi"
                onClick={() => {
                  EditPost();
                }}
                severity="success"
              />
              <Button
                label="Xóa bài viết"
                className="ml-[10px]"
                onClick={() => {
                  DeletePost();
                }}
                severity="danger"
              />
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        header={titleDetailPost}
        visible={postsModal}
        className="w-9/12"
        onHide={() => cancelModal()}
      >
        <div className="mx-auto my-10 w-full rounded-xl border px-4 py-6 text-gray-700">
          <div className="mb-5">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                alt="Simon Lewis"
              />
              <p className="ml-4 w-56">
                <strong className="block font-medium text-gray-700">
                  {nameAuthorDetailPost}
                </strong>
                <span className="truncate text-sm text-gray-400">
                  {createdAtDetailPost}
                </span>
              </p>
            </div>
          </div>
          <div className="mb-3">{contentDetailPost}</div>
          {checkLike ? (
            <div className="mt-4 flex items-center space-x-2">
              <button
                className="text-gray-500 hover:text-gray-800 "
                onClick={removeLike}
              >
                <i className="pi pi-heart-fill text-red-600"></i>
                <div>Yêu thích ({listLikePost.length})</div>
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center space-x-2">
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={addLike}
              >
                <i className="pi pi-heart"></i>
                <div>Yêu thích ({listLikePost.length})</div>
              </button>
            </div>
          )}
          <div className="flex first-letter:items-center justify-center border rounded mx-auto mt-5">
            <div className="w-full bg-white rounded-lg px-4 pt-2">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-full px-3 mb-2 mt-2">
                  <textarea
                    className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 placeholder-gray-700 focus:outline-none focus:bg-white"
                    placeholder="Nhập bình luận..."
                    value={contentCommentPost}
                    onChange={(e) => setContentCommentPost(e.target.value)}
                  ></textarea>
                </div>
                <div className="w-full flex items-start md:w-full px-3">
                  <div
                    className="cursor-pointer bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                    onClick={AddComment}
                  >
                    Gửi bình luận
                  </div>
                </div>
              </div>
            </div>
          </div>
          {commentPost.map((comment, index) => (
            <div className="mx-auto mt-10 w-full">
              <div className="rounded-md border p-4 bg-white">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    alt="Avatar"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {comment.nameUser}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {comment.createDate}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-800">{comment.content}</p>
                <div className="mt-4 flex items-center space-x-2">
                  {comment.like.filter((x) => x === author).length > 0 ? (
                    <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() =>
                        removeLikeComment({
                          listLikeComment: comment.like,
                          idComment: comment._id,
                        })
                      }
                    >
                      <i className="pi pi-heart-fill text-red-600"></i>
                      <div>
                        Yêu thích <strong>({comment.like.length})</strong>
                      </div>
                    </button>
                  ) : (
                    <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() =>
                        addLikeComment({
                          listLikeComment: comment.like,
                          idComment: comment._id,
                        })
                      }
                    >
                      <i className="pi pi-heart"></i>
                      <div>
                        Yêu thích <strong>({comment.like.length})</strong>
                      </div>
                    </button>
                  )}
                  <button className="text-gray-500 hover:text-gray-800">
                    <i className="pi pi-comments"></i>
                    <div>
                      Câu trả lời <strong>({comment.reply.length})</strong>
                    </div>
                  </button>
                </div>
              </div>
              {comment.reply
                .slice(0)
                .reverse()
                .map((reply, indexReply) => (
                  <div className="my-4 ml-10 rounded-md border p-4 bg-white">
                    <div className="flex items-center space-x-4">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                        alt="Avatar"
                      />
                      <div>
                        <h3 className="text-md font-medium">
                          {reply.nameUser}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {reply.createDate}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-800">{reply.content}</p>
                  </div>
                ))}
              <div className="flex first-letter:items-center justify-center border rounded mt-5 my-4 ml-10">
                <div className="w-full bg-white rounded-lg px-4 pt-2">
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                      <textarea
                        className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 placeholder-gray-700 focus:outline-none focus:bg-white"
                        placeholder="Nhập câu trả lời..."
                        value={replyChange[comment._id]}
                        onChange={(e) => {
                          setReplyChange({
                            ...replyChange,
                            [comment._id]: e.target.value,
                          });
                        }}
                      ></textarea>
                    </div>
                    <div className="w-full flex items-start md:w-full px-3">
                      <div
                        className="cursor-pointer bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                        onClick={() => AddReply({ id: comment._id })}
                      >
                        Gửi câu trả lời
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Dialog>
      <Toast ref={toast} />
      <div className="w-full h-auto mt-2 ">
        <div className="rounded-lg w-4/5 my-3 bg-white flex justify-start ">
          <TabMenu
            className="text-xs"
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => {
              if (e.index === 1) {
                clearNotification();
              }
              setActiveIndex(e.index);
            }}
          />
        </div>
      </div>
      {activeIndex === 0 && (
        <div className="overflow-y-auto w-full h-[400px]">
          <div className="rounded-lg h-auto mr-10 bg-white w-4/5">
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="px-4 py-2 bg-white rounded-t-lg">
                <InputText
                  placeholder="Nhập tiêu đề"
                  value={title}
                  className="w-full"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <InputTextarea
                  id="comment"
                  rows="4"
                  className="w-full text-sm text-gray-900 bg-white border-0 focus:ring-0"
                  placeholder="Viết nội dung..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t">
                <Button
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                  onClick={() => AddPosts({ check: false })}
                >
                  Đăng bài viết
                </Button>
              </div>
            </div>
          </div>
          {listPosts.map((post, index) => (
            <div className="px-10 py-6 bg-white rounded-lg shadow-md h-auto mt-5 mr-10 flex flex-row w-4/5">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-light text-gray-600">
                    {post.createDate}
                  </span>
                </div>
                <div className="mt-2">
                  <div
                    className="text-2xl text-gray-700 font-bold hover:underline cursor-pointer "
                    onClick={() => showModalPosts({ id: post._id })}
                  >
                    {post.title}
                  </div>
                  <p className="mt-2 text-gray-600">{post.content}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <a className="flex items-center" href="#">
                      <img
                        className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                        alt="avatar"
                        src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                      />

                      {post.nameAuthor}
                    </a>
                  </div>
                </div>
              </div>
              {post.author === author && (
                <>
                  <div className="grid justify-items-end w-full h-[30px]">
                    <Button
                      className=""
                      onClick={() => {
                        setEditId(post._id);
                        setVisible(true);
                        setEditPost(post.title);
                        setEditContent(post.content);
                      }}
                    >
                      <i className="pi pi-ellipsis-v"></i>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {activeIndex === 1 && (
        <div className="overflow-y-auto w-full h-[400px]">
          {isPermissionOnCourse && (
            <div className="rounded-lg h-auto mr-10 bg-white w-4/5">
              <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="px-4 py-2 bg-white rounded-t-lg">
                  <InputText
                    placeholder="Nhập tiêu đề"
                    className="w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <InputTextarea
                    id="comment"
                    rows="4"
                    className="w-full text-sm text-gray-900 bg-white border-0 focus:ring-0"
                    placeholder="Viết nội dung..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t">
                  <Button
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                    onClick={() => AddPosts({ check: true })}
                  >
                    Đăng bài viết
                  </Button>
                </div>
              </div>
            </div>
          )}
          {listNotificationPosts.map((post, index) => (
            <div className="px-10 py-6 bg-white rounded-lg shadow-md h-auto mt-5 mr-10 flex flex-row w-4/5">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-light text-gray-600">
                    {post.createDate}
                  </span>
                </div>
                <div className="mt-2">
                  <div
                    className="text-2xl text-gray-700 font-bold hover:underline cursor-pointer "
                    onClick={() => showModalPosts({ id: post._id })}
                  >
                    {post.title}
                  </div>
                  <p className="mt-2 text-gray-600">{post.content}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <a className="flex items-center" href="#">
                      <img
                        className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                        alt="avatar"
                        src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                      />

                      {post.nameAuthor}
                    </a>
                  </div>
                </div>
              </div>
              {post.author === author && (
                <>
                  <div className="grid justify-items-end w-full h-[30px]">
                    <Button
                      className=""
                      onClick={() => {
                        setEditId(post._id);
                        setVisible(true);
                        setEditPost(post.title);
                        setEditContent(post.content);
                      }}
                    >
                      <i className="pi pi-ellipsis-v"></i>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          {listNotificationPosts.length === 0 && (
            <div className="text-center w-4/5">Chưa có thông báo nào</div>
          )}
        </div>
      )}
    </>
  );
}
