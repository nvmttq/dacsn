import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import io from "socket.io-client";

import * as constant from "../constant.js";
import Chat from "./Chat.js";
import Assignments from "../pages/Assignments.js";

export default function GroupCard() {

  let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const { groupToken } = useParams();
  const [type, setType] = useState(0);
  const [participants, setParticipants] = useState();

  const [conversations, setConversations] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    fetch(`${constant.URL_API}/groups/${groupToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((group) => {
        console.log(group)
        setGroup(group);
        const conversations = group.conversations.map(m => {
          return {
            conversation: m,
            isOwn: m.userID,
          };
        });
        setConversations(conversations);

        setParticipants(group.participants);
        
        console.log(conversations);
      });
  }, []);

  return (
    <>
      <div className="ml-[25px] mt-[10px]">
        <span className="">
          <Button
            label="Chat nhóm"
            onClick={() => setType(0)}
            className="p-0 px-3 py-1 text-base"
          />
          <Button
            label="Bài tập"
            onClick={() => setType(1)}
            className="p-0 px-3 py-1 text-base ml-[25px]"
          />
        </span>
        <div>
          {type === 0 && <Chat participants={participants} conversations={conversations} groupToken={groupToken} user={user} setConversations={setConversations} />}
          
          {type === 1 && <Assignments />}
        </div>
      </div>
    </>
  );
}
