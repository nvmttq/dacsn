import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import axios from "axios";
import moment from "moment";

export default function Posts() {
  const toast = useRef(null);
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Đăng bài thành công",
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
  const [checkLike, setCheckLike] = useState(false);

  const [listPosts, setListPosts] = useState([]);
  const author = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
  const nameUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  useEffect(() => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        setListPosts(response.data.dataPosts.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const fetchDataPosts = () => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        setListPosts(response.data.dataPosts.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const fetchDataComment = ({id}) => {
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
            setCommentPost(
              res.data.dataComments
                .filter((x) => x.idPost === post[0]._id)
                .reverse()
            );
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const AddPosts = () => {
    axios
      .post("http://localhost:3002/posts", {
        title: title,
        content: content,
        author: author,
        nameAuthor: nameUser,
        createDate: moment().format("DD-MM-YYYY HH:MM"),
      })
      .then(function (response) {
        fetchDataPosts();
        showSuccess();
      })
      .catch(function (error) {
        console.log(error);
        showError();
      });
  };

  const AddComment = () => {
    axios
      .post("http://localhost:3002/comments", {
        idPost: idDetailPost,
        idUser: author,
        nameUser: nameUser,
        imagePath: "",
        content: contentCommentPost,
        createDate: moment().format("DD-MM-YYYY HH:MM"),
        reply: [],
      })
      .then(function (response) {
        fetchDataComment({id: idDetailPost});
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [contentReply, setContentReply] = useState("");
  const AddReply = ({ id }) => {
    axios
      .get("http://localhost:3002/comments", {})
      .then(function (response) {
        let check = response.data.dataComments.filter((x) => x._id === id)[0]
          .reply;
        const reply = {
          idUser: author,
          nameUser: nameUser,
          createDate: moment().format("DD-MM-YYYY HH:MM"),
          content: contentReply,
        };
        check.push(reply);
        axios
          .put("http://localhost:3002/comments", {
            id: id,
            reply: check,
          })
          .then(function (res) {
            fetchDataComment({id: idDetailPost});
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
        fetchDataComment({id: idDetailPost});
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
            fetchDataComment({id: idDetailPost});
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  const [postsModal, setPostModal] = useState(false);
  const showModalPosts = ({ id }) => {
    setPostModal(true);
    fetchDataComment({id: id});
  };
  const cancelModal = () => {
    setPostModal(false);
    setCheckLike(false);
  }

  return (
    <>
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
                    required
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
                  <button className="text-gray-500 hover:text-gray-800">
                    <i className="pi pi-reply"></i>
                    <div>Trả lời</div>
                  </button>
                  <button className="text-gray-500 hover:text-gray-800">
                    <i className="pi pi-comments"></i>
                    <div>
                      Câu trả lời{" "}
                      <strong className="text-">
                        ({comment.reply.length})
                      </strong>
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
                        required
                        onChange={(e) => setContentReply(e.target.value)}
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
      <div className="overflow-y-auto h-[500px] mt-5">
        <div className="rounded-lg h-auto mt-5 ml-10 mr-10 bg-white">
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="px-4 py-2 bg-white rounded-t-lg">
              <InputText
                placeholder="Nhập tiêu đề"
                className="w-full"
                onChange={(e) => setTitle(e.target.value)}
              />
              <InputTextarea
                id="comment"
                rows="4"
                className="w-full text-sm text-gray-900 bg-white border-0 focus:ring-0"
                placeholder="Viết nội dung..."
                required
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t">
              <Button
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                onClick={AddPosts}
              >
                Đăng bài viết
              </Button>
            </div>
          </div>
        </div>
        {listPosts.map((post, index) => (
          <div className="px-10 py-6 bg-white rounded-lg shadow-md h-auto mt-5 ml-10 mr-10">
            <div className="flex justify-between items-center">
              <span className="font-light text-gray-600">
                {post.createDate}
              </span>
            </div>
            <div className="mt-2">
              <div
                className="text-2xl text-gray-700 font-bold hover:underline cursor-pointer"
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
        ))}
      </div>
    </>
  );
}