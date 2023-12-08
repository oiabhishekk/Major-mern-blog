import React, { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passswordVisible, setPasswordVisible] = useState(false);
  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={
          type == "password" ? (passswordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className={`input-box `}
      />
      <i className={`${icon} input-icon`}></i>
      {type == "password" ? (
        <i
          className={`fi fi-rr-eye${
            passswordVisible ? "" : "-crossed"
          } input-icon left-[auto] right-4 cursor-pointer `}
          onClick={() => setPasswordVisible((prev) => !prev)}
        ></i>
      ) : (
        ""
      )}
      
    </div>
  );
};

export default InputBox;
