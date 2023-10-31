import React, { useEffect, useRef, useState, useParams } from "react";
import io from "socket.io-client";
import moment from "moment";
import MoodIcon from "@mui/icons-material/Mood";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { FileUpload } from "primereact/fileupload";
import { ListBox } from "primereact/listbox";
import { Splitter, SplitterPanel } from "primereact/splitter";

import * as constant from "../constant.js";
import ChatMessage from "./ChatMessage.js";

export default function Chat({
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

  console.log(socketRef)
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    socketRef.current = io.connect(`${constant.URL_API}/group`);
    
    socketRef.current.on("abc", (dataMessage) => {
      socketRef.current.emit("ok chua")
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
    if(!textSendRef.current.value) return;
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
    <Splitter className="w-full">
      <SplitterPanel size={55} minSize={10}>
        <div
          className="chat-container bg-blue-500 ml-[20px] h-[500px] mt-2 flex-grow overflow-y-scroll"
          ref={scrollToBottom}
          onLoad={(e) =>
            (document.querySelector(".chat-container").scrollTop =
              document.querySelector(".chat-container").scrollHeight)
          }
        >
          {conversations && conversations.length >0 ? (
            conversations.map((m, index) => (
              <ChatMessage key={index} dataMessage={m} />
            ))
          ) : (
            <div>Hãy nhắn gì đó gửi tới mọi người</div>
          )}
        </div>

        <form
          className="send-chat ml-[20px] w-full flex justify-between items-center py-3 gap-x-2"
          onSubmit={handleSendChat}
        >
          <div className="flex items-center w-4/5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
              alt="avatar 3"
              style={{ width: "30px", height: "30px" }}
              className="w-10 h-full"
            />
            <input
              type="text"
              placeholder="Soạn tin"
              className="text-md outline-none h-[40px] w-full border-solid border-2 border-blue-500 pl-2"
              autoComplete="false"
              ref={textSendRef}
            />
          </div>
          <div className="w-1/5 text-gray-500 flex items-center gap-x-2">
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
      </SplitterPanel>
      <SplitterPanel
        size={25}
        minSize={25}
        className="card flex flex-col font-semibold p-3"
      >
        <p className="text-[20px] flex justify-center">Thành viên trong nhóm</p>
        <ListBox
          filter
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={participants}
          optionLabel="nameDisplay"
          className="md:w-14rem"
        />
      </SplitterPanel>
    </Splitter>
  );
}
