import React, { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { FileUpload } from "primereact/fileupload";

import MoodIcon from "@mui/icons-material/Mood";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

import ChatMessage from "./ChatMessage";

const headerSidebar = (
  <>
    <h2 style={{ marginBottom: 0 }}>Tin nhắn</h2>
  </>
);
export default function ChatSidebar({
  visibleChatSidebar,
  setVisibleChatSidebar,
  socketRef,
  userID,
  roomID,
  nameDisplay,
}) {

  const textSendRef = useRef(null);
  const fileSendRef = useRef(null);
  const emoteSendRef = useRef(null);
  const scrollToBottom = useRef();
  const messageseRef = useRef([]);
  const [messages, setMessages] = useState([]);


  function handleSendChat(e) {
    e.preventDefault();
    console.log({
      text: textSendRef.current.value,
      file: fileSendRef.current
        ? fileSendRef.current.getFiles()
        : "NOT FOUND SRC FILE",
      emote: emoteSendRef.current ? emoteSendRef.current : "NOT FOUNT EMOTE",
    });

    socketRef.current.emit("send message", {
      text: textSendRef.current.value,
      file: fileSendRef.current
        ? fileSendRef.current.getFiles()
        : "NOT FOUND SRC FILE",
      emote: emoteSendRef.current ? emoteSendRef.current : "NOT FOUNT EMOTE",
      userID: userID,
      socketID: socketRef.current.id,
      roomID,
      nameDisplay,
    });
    textSendRef.current.value = "";
    textSendRef.current.focus();
    fileSendRef.current = null;
    emoteSendRef.current = null;
  }

  function onShowSidebar() {

    socketRef.current.emit("get all message", { roomID, userID: userID });

    socketRef.current.on("get all message", (dataMessage) => {

      messageseRef.current = dataMessage;
      setMessages(messageseRef.current);

    });

    socketRef.current.on("return message", (dataMessage) => {
      
      socketRef.current.emit("get all message", { roomID, userID: userID });

      socketRef.current.on("get all message", (dataMessage) => {
        messageseRef.current = dataMessage;
        setMessages(dataMessage);
      });

    });

    textSendRef.current.focus();
  }
  return (
    <Sidebar
      visible={visibleChatSidebar}
      position="right"
      header={headerSidebar}
      onHide={() => setVisibleChatSidebar(false)}
      onShow={() => onShowSidebar()}
      pt={{
        content: {
          className: "flex flex-col !px-2 !py-2",
        },
      }}
    >
      <div
        className="chat-container mt-2 flex-grow overflow-y-scroll"
        ref={scrollToBottom}
        onLoad={(e) =>
          (document.querySelector(".chat-container").scrollTop =
            document.querySelector(".chat-container").scrollHeight)
        }
      >
        {messages ? (
          messages.map((m, index) => (
            <ChatMessage key={index} dataMessage={m} />
          ))
        ) : (
          <div>Hãy nhắn gì đó gửi tới mọi người</div>
        )}
      </div>

      <form onSubmit={handleSendChat} className="send-chat mt-auto">
        <div className="w-full text-gray-500 flex justify-start items-center pe-3 pt-3 mt-2 gap-2">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
            alt="avatar 3"
            style={{ width: "30px", height: "100%" }}
            className="w-10 h-full"
          />
          <input
            type="text"
            id="exampleFormControlInput2"
            placeholder="Soạn tin"
            className="text-md outline-none"
            ref={textSendRef}
            autoComplete="false"
          />
          {/* <AttachFileIcon style={{ fontSize: "20px" }} /> */}
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            chooseOptions={{
              icon: <AttachFileIcon />,
              className: "p-0",
            }}
            chooseLabel=" "
            ref={fileSendRef}
          />
          <MoodIcon style={{ fontSize: "20px" }} />
          <SendIcon style={{ color: "#1976D2", fontSize: "20px" }} />
        </div>
      </form>
    </Sidebar>
  );
}
