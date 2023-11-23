import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import * as constant from "../constant.js";
import Chat from "./Chat.js";
import Assignments from "../pages/Assignments.js";
import axios from "axios";

export default function GroupCard() {
  let user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const { groupToken } = useParams();
  const [type, setType] = useState(0);
  const [participants, setParticipants] = useState();

  const [conversations, setConversations] = useState(null);
  const [group, setGroup] = useState(null);
  const [assignments, setAssignments] = useState(null);

  const Leave = () => {
    console.log(group);
    axios
      .put(constant.URL_API + "/groups/update-participant", {
        id: group._id,
        participants: participants.filter((x) => x.userID !== user.username),
      })
      .then(function (response) {
        setVisible(false);
        navigate("/groups");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetch(`${constant.URL_API}/groups/${groupToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ group, assignments }) => {
        console.log(group, assignments);
        console.log(group);
        setGroup(group);
        const conversations = group.conversations.map((m) => {
          return {
            conversation: m,
            isOwn: m.userID,
          };
        });

        setConversations(conversations);

        setParticipants(group.participants);

        setAssignments(assignments);

        console.log(conversations);
      });
  }, []);

  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Bạn có chắc chắn muốn rời nhóm?"
        accept={Leave}
      ></ConfirmDialog>
      <div className="mt-5 h-[calc(100vh-20px)] px-3">
        <div className="mb-5 font-bold text-xl text-secondary">
          {group ? group.title : ""}
        </div>
        <span className="mb-5 block relative">
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
          <Button
            severity="danger"
            icon="pi pi-sign-out"
            label="Rời nhóm"
            onClick={() => setVisible(true)}
            className="p-0 px-3 py-1 text-base ml-[25px] right-0 absolute"
          />
        </span>
        <div>
          {type === 0 && (
            <Chat
              participants={participants}
              conversations={conversations}
              groupToken={groupToken}
              user={user}
              setConversations={setConversations}
            />
          )}

          {type === 1 && (
            <Assignments assignments={assignments} group={group} />
          )}
        </div>
      </div>
    </>
  );
}
