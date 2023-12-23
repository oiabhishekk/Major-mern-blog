import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
  let navigate = useNavigate();
  let {blog_id}=useParams()
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let characterLimit = 250;
  let tagLimit = 10;
  let {
    blog,
    setBlog,
    blog: { banner, title, tags, des, content },
    setEditorState,
  } = useContext(EditorContext);
  const handleCloseEvent = () => {
    setEditorState("editor");
  };
  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };
  const handleBlogDescriptionChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        } else {
          toast.error(`You can't add more than ${tagLimit} tags`);
        }
      }
      e.target.value = "";
    }
  };
  const publishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write title for ur Blog");
    }
    if (!des.length || des.length > characterLimit) {
      return toast.error(
        `Write a description about your blog within ${characterLimit} characters to publish`
      );
    }
    if (!tags.length) {
      return toast.error("Enter atleast one tag.");
    }
    let loadingToast = toast.loading("Publishing...");
    e.target.classList.add("disable");
    let blogObj = { title, banner, des, content, tags, draft: false };
    axios
      .post((import.meta.env.VITE_SERVER_DOMAIN + "/create-blog"), {...blogObj,id:blog_id}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Published");
        setTimeout(() => {
          navigate("/");
        }, 500);
      }).catch(({response})=>{
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        return toast.error(response.data.error)
      })
  };
  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[500px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-galesio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <div className="border-grey">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />
          <p className="text-dark-grey mb-2 mt-9">
            Short description for your blog
          </p>
          <textarea
            className="h-40 resize-none leading-7 input-box pl-4"
            placeholder="Type description"
            maxLength={characterLimit}
            defaultValue={des}
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          />
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length}characters left
          </p>
          <p className="text-dark-grey mb-2 my-9">Tags</p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              onKeyDown={handleKeyDown}
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white "
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">
            Tags left : {tagLimit - tags.length}
          </p>
          <button onClick={publishBlog} className="btn-dark px-8">
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
