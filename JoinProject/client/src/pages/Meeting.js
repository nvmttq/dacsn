import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Button } from "@mui/material";

import Video from "../components/Video.js";
import ChatSidebar from "../components/ChatSidebar1.js";

export default function Meeting() {
  const roomID = "abc";
  console.log("ROOM ID ", roomID);
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const [visibleChatSidebar, setVisibleChatSidebar] = useState(false);
  const dataFetch = useRef(false);
  const [isOnVideo, setIsOnVideo] = useState(false);

  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef([]);

  const ownVideo = useRef();
  const ownStream = useRef();
  console.log(peers);
  useEffect(() => {
    if (dataFetch.current) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        console.log("OWN STREAM", stream);
        ownStream.current = stream;
        ownVideo.current.srcObject = stream;

        socketRef.current = io.connect("http://localhost:3002");
        socketRef.current.emit("join-room", { roomID, user });

        socketRef.current.on("all users", (users) => {
          console.log("ALL USER", users);

          const peers = [];
          users.forEach((userMeeting) => {
            const peer = createPeer(
              userMeeting.socketID,
              socketRef.current.id,
              stream,
              userMeeting.nameDisplay
            );

            peersRef.current.push({
              peerID: userMeeting.socketID,
              peer,
              nameDisplay: user.name,
            });

            peers.push(peer);
          });

          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(
            payload.signal,
            payload.callerID,
            stream,
            payload.nameDisplay
          );
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            nameDisplay: payload.nameDisplay,
          });
          const a = peers;
          a.push(peer);
          console.log(a);
          setPeers(a);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          console.log(payload);
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left", (socketID) => {
          const peerObj = peersRef.current.find((p) => p.peerID === socketID);
          if (peerObj) {
            peerObj.peer.destroy();
            const peers = peersRef.current.filter((p) => p.peerID !== socketID);
            console.log(`user ${socketID} leaved meeting`);
            peersRef.current = peers;
            setPeers(peers);
            console.log(peersRef);
          }
        });
      });
    dataFetch.current = true;
  }, []);

  function createPeer(userToSignal, callerID, stream, nameDisplay) {
    console.log("CREATE PEER STREAM", stream);
    //create peer for user already meeting
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer["nameDisplay"] = nameDisplay;
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        nameDisplay: user.name,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream, nameDisplay) {
    console.log("add peer stream", stream);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      nameDisplay,
    });
    peer["nameDisplay"] = nameDisplay;

    peer.on("signal", (signal) => {
      console.log(signal, callerID);
      socketRef.current.emit("returning signal", {
        signal,
        callerID,
        nameDisplay,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const handleCamera = () => {
    const videoTrack = ownStream.current
      .getTracks()
      .find((track) => track.kind === "video");
    videoTrack.enabled = !videoTrack.enabled;
    setIsOnVideo(!isOnVideo);
  };
  return (
    <div className="wrapper">
      MEETING HERE
      {/* <Video ref={ownVideo} username={"z"} autoPlay></Video> */}
      <video ref={ownVideo} autoPlay className="w-[40%] h-[40%]"></video>
      {user.name}
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
      <div className="meeting-footer flex gap-10">
        {isOnVideo ? (
          <VideocamIcon
            fontSize="medium"
            onClick={handleCamera}
            style={{
              color: "white",
              background: "#2B2D2E",
              padding: "10px",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        ) : (
          <VideocamOffIcon
            fontSize="medium"
            onClick={handleCamera}
            style={{
              color: "white",
              background: "#2B2D2E",
              padding: "10px",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        )}
        <div className="chat-sidebar">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => setVisibleChatSidebar(true)}
            className="bg-black"
          >Chat</Button>
          <ChatSidebar nameDisplay={user.name} userID={user.username} roomID={roomID} socketRef={socketRef} visibleChatSidebar={visibleChatSidebar} setVisibleChatSidebar={setVisibleChatSidebar}/>
        </div>
      </div>
    </div>
  );
}
