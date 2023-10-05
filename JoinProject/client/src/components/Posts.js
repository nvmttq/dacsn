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

  const [titleDetailPost, setTitleDetailPost] = useState("");
  const [contentDetailPost, setContentDetailPost] = useState("");
  const [authorDetailPost, setAuthorDetailPost] = useState("");
  const [nameAuthorDetailPost, setNameAuthorDetailPost] = useState("");
  const [createdAtDetailPost, setCreatedAtDetailPost] = useState("");
  const [checkLike, setCheckLike] = useState(false);
  const [checkBookmark, setCheckBookmark] = useState(false);

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
        showSuccess();
      })
      .catch(function (error) {
        console.log(error);
        showError();
      });
  };

  const [postsModal, setPostModal] = useState(false);
  const showModalPosts = ({ id }) => {
    setPostModal(true);
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        let post = response.data.dataPosts.filter((x) => x._id === id);
        setTitleDetailPost(post[0].title);
        setContentDetailPost(post[0].content);
        setCreatedAtDetailPost(post[0].createDate);
        setCheckLike(post[0].like);
        setCheckBookmark(post[0].bookmark);
        setAuthorDetailPost(post[0].author);
        setNameAuthorDetailPost(post[0].nameAuthor);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Dialog
        header={titleDetailPost}
        visible={postsModal}
        className="w-9/12"
        onHide={() => setPostModal(false)}
      >
        <div class="mx-auto my-10 w-full rounded-xl border px-4 py-6 text-gray-700">
          <div class="mb-5">
            <div class="flex items-center">
              <img
                class="h-10 w-10 rounded-full object-cover"
                src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                alt="Simon Lewis"
              />
              <p class="ml-4 w-56">
                <strong class="block font-medium text-gray-700">
                  {nameAuthorDetailPost}
                </strong>
                <span class="truncate text-sm text-gray-400">
                  {createdAtDetailPost}
                </span>
              </p>
            </div>
          </div>
          <div class="mb-3">{contentDetailPost}</div>
          <div class="mt-4 flex items-center space-x-2">
            <button class="text-gray-500 hover:text-gray-800">
              <i className="pi pi-heart"></i>
              <div>Yêu thích</div>
            </button>
            <button class="text-gray-500 hover:text-gray-800">
              <i className="pi pi-bookmark"></i>
              <div>Đánh dấu</div>
            </button>
          </div>
          <div class="flex first-letter:items-center justify-center shadow-lg mx-auto">
            <div class="w-full bg-white rounded-lg px-4 pt-2">
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-full px-3 mb-2 mt-2">
                  <textarea
                    class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 placeholder-gray-700 focus:outline-none focus:bg-white"
                    placeholder="Type Your Comment"
                    required
                  ></textarea>
                </div>
                <div class="w-full flex items-start md:w-full px-3">
                  <div class="cursor-pointer bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">
                    Gửi bình luận
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mx-auto mt-10 w-full">
            <div class="rounded-md border p-4 bg-white">
              <div class="flex items-center space-x-4">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  alt="Avatar"
                />
                <div>
                  <h2 class="text-lg font-semibold">John Doe</h2>
                  <p class="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p class="mt-4 text-gray-800">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                auctor suscipit nisi, eu malesuada augue consectetur eget. Nam
                molestie convallis nunc at hendrerit. Aliquam ut sapien sit amet
                massa vehicula ultrices. In bibendum lacinia purus ut elementum.
              </p>
              <div class="mt-4 flex items-center space-x-2">
                <button class="text-gray-500 hover:text-gray-800">
                  <i className="pi pi-reply"></i>
                  <div>Trả lời</div>
                </button>
              </div>
            </div>
            <div class="my-4 ml-10 rounded-md border p-4 bg-white">
              <div class="flex items-center space-x-4">
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  alt="Avatar"
                />
                <div>
                  <h3 class="text-md font-medium">Jane Doe</h3>
                  <p class="text-sm text-gray-500">30 minutes ago</p>
                </div>
              </div>
              <p class="mt-2 text-gray-800">
                Vivamus rutrum sem ut ipsum aliquam, eget posuere odio pulvinar.
                Sed in eleifend odio, a congue nisl. Nam ac metus posuere,
                maximus metus et, tincidunt risus.
              </p>
            </div>

            <div class="my-4 ml-10 rounded-md border p-4 bg-white">
              <div class="flex items-center space-x-4">
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  alt="Avatar"
                />
                <div>
                  <h3 class="text-md font-medium">Jane Doe</h3>
                  <p class="text-sm text-gray-500">30 minutes ago</p>
                </div>
              </div>
              <p class="mt-2 text-gray-800">
                Vivamus rutrum sem ut ipsum aliquam, eget posuere odio pulvinar.
                Sed in eleifend odio, a congue nisl. Nam ac metus posuere,
                maximus metus et, tincidunt risus.
              </p>
            </div>
          </div>
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
          <div class="px-10 py-6 bg-white rounded-lg shadow-md h-auto mt-5 ml-10 mr-10">
            <div class="flex justify-between items-center">
              <span class="font-light text-gray-600">{post.createDate}</span>
            </div>
            <div class="mt-2">
              <div
                class="text-2xl text-gray-700 font-bold hover:underline cursor-pointer"
                onClick={() => showModalPosts({ id: post._id })}
              >
                {post.title}
              </div>
              <p class="mt-2 text-gray-600">{post.content}</p>
            </div>
            <div class="flex justify-between items-center mt-4">
              <div>
                <a class="flex items-center" href="#">
                  <img
                    class="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
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
