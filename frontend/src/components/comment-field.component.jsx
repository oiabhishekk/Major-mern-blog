import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action }) => {
  let {blog,blog:{
    _id,
    author: { _id: blog_author },comments,activity,activity:{total_comments,total_parent_comments}},setBlog,setTotalParentCommentLoaded
  } = useContext(BlogContext);
  let {
    userAuth: { access_token,username,fullname,profile_img },
  } = useContext(UserContext);
  let [comment, setComment] = useState("");


  //comments handeling
  const handleCommentFunction = () => {
    if (!access_token) {
      return toast.error("Login first to leave a comment");
    }
    if (!comment.length) {
      return toast.error("Write something to post a comment...");
    }
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        { _id, blog_author, comment },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("")
        data.commented_by={personal_info:{username,profile_img,fullname}}
        let newCommentArr;
        data.childrenLevel=0
        newCommentArr=[data]
        let parentCommentIncrementVal=1
        setBlog({...blog,comments:{...comments,results:newCommentArr},activity:{...activity,total_comments:total_comments+1,total_parent_comments:total_parent_comments+ parentCommentIncrementVal }})
        setTotalParentCommentLoaded(prev=>prev+parentCommentIncrementVal)

      })
      .catch((err) => {
        console.log(err);
      });
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
