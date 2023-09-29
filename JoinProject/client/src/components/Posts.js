import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import axios from "axios";

export default function Posts() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const AddPosts = () => {
    fetch
      .post("http://localhost:3002/posts", {
        title: title,
        content: content,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <div className="rounded-lg h-auto mt-5 ml-10 mr-10 bg-white">
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="px-4 py-2 bg-white rounded-t-lg">
            <label for="comment" className="sr-only">
              Your comment
            </label>
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
    </>
  );
}
