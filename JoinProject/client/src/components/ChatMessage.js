import React from "react";

import moment from "moment";

const convertDateMongodb = (date) => {
  return (
    moment(date).format("DD-MM-YYYY") + " | " + moment(date).format("HH:mm:ss")
  );
};
function ChatMessage({ dataMessage }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <div className="chat-message mb-4">
      {dataMessage.isOwn === user.username ? (
        <div className="flex flex-row justify-end mr-2">
          <div>
            <p className="small p-2 me-3 mb-1 text-white rounded-lg bg-[#3B71CA]">
              {dataMessage.conversation.content.text}
            </p>
            <p className="small me-3 mb-3 text-gray-500 d-flex justify-end">
              {convertDateMongodb()}
            </p>
          </div>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
            alt="avatar 1"
            style={{ width: "45px", height: "100%" }}
          />
        </div>
      ) : (
        <div className="flex flex-row justify-start">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
            alt="avatar 1"
            style={{ width: "45px", height: "100%" }}
          />
          <div>
            <p className="small p-2 ms-3 mb-1 rounded-lg bg-gray-200">
              {dataMessage.conversation.content.text}
            </p>
            <p className="small ms-3 mb-3 text-gray-500">
              {convertDateMongodb()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
