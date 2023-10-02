import React from "react";

import moment from "moment"


const convertDateMongodb = (date) => {
  return moment(date).format("DD-MM-YYYY") + " | "+moment(date).format("HH:mm:ss")
}
function ChatMessage({ dataMessage }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  return (
    <div className="chat-message">
      {dataMessage.isOwn === user.username ? (
        <div className="flex flex-row justify-end">
          <div>
            <p className="small p-2 me-3 mb-1 rounded-lg bg-[#3B71CA] text-white">
              {dataMessage.conversation.content.text}
            </p>
            <p className="text-sm me-3 mb-3 rounded-lg text-gray-500">
            {convertDateMongodb()}
            </p>
          </div>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
            alt="avatar 1"
            style={{ width: "40px", height: "100%" }}
            className="w-11 h-full"
          />
        </div>
      ) : (
        <div className="flex flex-row justify-start">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
            alt="avatar 1"
            style={{ width: "40px", height: "100%" }}
            className="w-11 h-full"
          />
          <div>
            <p className="small p-2 me-3 mb-1 rounded-lg bg-[#F5F6F7]">
            {dataMessage.conversation.content.text}
            </p>
            <p className="text-sm me-3 mb-3 rounded-lg text-gray-500">
            {convertDateMongodb()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
