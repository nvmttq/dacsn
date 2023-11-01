import React, { useEffect, useRef, useState } from "react";
import MoodIcon from "@mui/icons-material/Mood";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { Divider } from "primereact/divider";
import io from "socket.io-client";
import { FileUpload } from "primereact/fileupload";
import { ListBox } from "primereact/listbox";
import { Splitter, SplitterPanel } from "primereact/splitter";

import * as constant from "../constant.js";
import ChatMessage from "./ChatMessage.js";

export default function ChatComponent({
  user,
  groupToken,
  participants,
  conversations,
  setConversations,
}) {
  const socketRef = useRef();
  const textSendRef = useRef(null);
  const fileSendRef = useRef(null);
  const emoteSendRef = useRef(null);
  const scrollToBottom = useRef();

  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    socketRef.current = io.connect(`${constant.URL_API}/group`);

    socketRef.current.on("abc", (dataMessage) => {
      socketRef.current.emit("ok chua");
      const conversations = dataMessage.map((m) => {
        return {
          conversation: m,
          isOwn: m.userID,
        };
      });

      setConversations(conversations);

      console.log(conversations);
    });
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!textSendRef.current.value) return;
    console.log({
      text: textSendRef.current.value,
      file: fileSendRef.current
        ? fileSendRef.current.getFiles()
        : "NOT FOUND SRC FILE",
      emote: emoteSendRef.current ? emoteSendRef.current : "NOT FOUNT EMOTE",
    });

    socketRef.current.emit("send message", {
      message: {
        text: textSendRef.current.value,
        file: fileSendRef.current
          ? fileSendRef.current.getFiles()
          : "NOT FOUND SRC FILE",
        emote: emoteSendRef.current ? emoteSendRef.current : "NOT FOUNT EMOTE",
      },
      user,
      socketID: socketRef.current.id,
      groupToken,
    });

    textSendRef.current.value = "";
    textSendRef.current.focus();
    fileSendRef.current = null;
    emoteSendRef.current = null;
  };
  return (
    <Splitter className="w-full h-[80%]">
      <SplitterPanel size={55} minSize={10} className="px-3">
        <div className="card-header flex justify-between items-center p-3">
          <h5 className="mb-0">Chat</h5>
          <button className="btn btn-primary btn-sm ripple-dark">
            Let's Chat App
          </button>
        </div>
        <div
          className="card-body chat-container h-[400px] mt-2 flex-grow overflow-y-scroll"
          ref={scrollToBottom}
          onLoad={() =>
            (document.querySelector(".chat-container").scrollTop =
              document.querySelector(".chat-container").scrollHeight)
          }
        >
          {conversations && conversations.length > 0 ? (
            conversations.map((m, index) => (
              <ChatMessage key={index} dataMessage={m} />
            ))
          ) : (
            <div>Hãy nhắn gì đó gửi tới mọi người</div>
          )}
        </div>
        <Divider className="mb-0" style={{margin: '0'}}/>
        <form
          className="card-footer text-gray-500 flex justify-start items-center w-full p-3"
          onSubmit={handleSendChat}
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
            alt="avatar 3"
            style={{ width: "40px", height: "100%" }}
          />
          <input
            type="text"
            placeholder="Soạn tin"
            className=" block w-full outline-none pl-3"
            autoComplete="false"
            ref={textSendRef}
          />
          <MoodIcon className="ms-1 text-gray-500 block" />
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
          <SendIcon className="ms-3 text-gray-500 block" />
        </form>
      </SplitterPanel>
      <SplitterPanel
        size={25}
        minSize={25}
        className="card flex flex-col font-semibold p-3"
      >
        <p className="text-[20px] flex justify-center">Thành viên trong nhóm</p>
        <ListBox
          filter
          value={selectedParticipant}
          onChange={(e) => setSelectedParticipant(e.value)}
          options={participants}
          optionLabel="nameDisplay"
          className="md:w-14rem"
        />
      </SplitterPanel>
    </Splitter>
  );
}
