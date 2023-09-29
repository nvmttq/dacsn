import React, { useEffect, useRef } from "react";

export default function Video({ peer }) {
  const ref = useRef();
  console.log(peer);
  useEffect(() => {
    peer.on("stream", (stream) => {
      console.log(stream);
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div>
      <video playsInline autoPlay ref={ref} className="w-[20%] h-[30%]"></video>
      <span className="username">{peer.nameDisplay}</span>
    </div>
  );
}
