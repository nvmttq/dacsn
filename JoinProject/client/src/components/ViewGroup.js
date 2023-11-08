import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

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
  const [assignments, setAssignments] = useState(null);
  

  useEffect(() => {
    fetch(`${constant.URL_API}/groups/${groupToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({
        group,
        assignments
      }) => {
        
        console.log(group, assignments)
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
        
        setAssignments(assignments);

        console.log(conversations);
      
  })}, []);

  return (
    <>
      <div className="mt-5 h-[calc(100vh-20px)] px-3">
        <div className="mb-5 font-bold text-xl text-secondary">{group ? group.title : ''}</div>
        <span className="mb-5 block">
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
          
          {type === 1 && <Assignments assignments={assignments} group={group}/>}
        </div>
      </div>
    </>
  );
  }
