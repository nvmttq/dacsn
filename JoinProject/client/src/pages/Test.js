import React, { useRef, useState } from "react";

function Test() {
    const [again, setAgain] = useState(false);
  const ref = useRef({
    1: "123"
  });
  console.log(ref)
  const handleChange = () => {
    console.log(ref.current[1])
    ref.current[1] = "";
    console.log(ref.current[1])
    setAgain(prev => !prev)
    console.log(document.getElementsByTagName('textarea'));
  }
  return (
   <div>
        <textarea defaultValue={again ? "123" : "456"} onChange={(e) => ref.current[1] = e.target.value} placeholder="text here">

        </textarea>
        <button onClick={() => handleChange()}>asfafasfa</button>
   </div>
  );
}

export default Test;
