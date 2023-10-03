import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
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

  const [listPosts, setListPosts] = useState([]);
  const author = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  useEffect(() => {
    axios
      .get("http://localhost:3002/posts", {})
      .then(function (response) {
        console.log(response);

        setListPosts(response.data.dataPosts);
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
  const showModalPosts = () => {
    setPostModal(true);
  };

  return (
    <>
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
              <span class="font-light text-gray-600">{post.createdAt}</span>
            </div>
            <div class="mt-2">
              <a
                class="text-2xl text-gray-700 font-bold hover:underline"
                href="#"
              >
                {post.title}
              </a>
              <p class="mt-2 text-gray-600">{post.content}</p>
            </div>
            <div class="flex justify-between items-center mt-4">
              <div>
                <a class="flex items-center" href="#">
                  <img
                    class="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                    alt="avatar"
                  />
                  <h1 class="text-gray-700 font-bold hover:underline">
                    {post.author}
                  </h1>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
