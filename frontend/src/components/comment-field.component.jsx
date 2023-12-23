import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";

const CommentField = ({ action }) => {
  let {
    userAuth: { access_token  },
  } = useContext(UserContext);
  let [comment, setComment] = useState("");
  const handleCommentFunction = () => {
    if (!access_token) {
      return toast.error("Login first to leave a comment");
    }
  };
  return (
    <>
      <Toaster />
      <textarea
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        className="placeholder:text-dark-grey input-box pl-5 resize-none h-[150px] overflow-auto"
        placeholder="Leave a comment..."
      ></textarea>
      <button onClick={handleCommentFunction} className="btn-dark mt-5 px-10">
        {" "}
        {action}
      </button>
    </>
  );
};

export default CommentField;
