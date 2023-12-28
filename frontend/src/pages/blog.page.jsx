import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";
export const BlogContext = createContext({});
export const blogStructure = {
  title: "",
  des: "",
  content: "",
  tags: [],
  activity: { total_likes: 0 },
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};
const BlogPage = () => {
  let { blog_id } = useParams();
  let [similarBlogs, setSimilarBlogs] = useState(null);
  let [blog, setBlog] = useState(blogStructure);
  let [isLikedByUser, setIsLikedByUser] = useState(false);
  let [loading, setLoading] = useState(true);
  let [commentWrapper, setCommentWrapper] = useState(false);
  let [totalParentCommentLoaded, setTotalParentCommentLoaded] = useState(0);
  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })

      .then(async ({ data: { blog } }) => {
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun:setTotalParentCommentLoaded,
        });


        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eleminateBlogId: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });

        setLoading(false);
      });
  };
  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);
  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentWrapper(false);
    setTotalParentCommentLoaded(0);
  };
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setIsLikedByUser,
            totalParentCommentLoaded,
            setTotalParentCommentLoaded,
            commentWrapper,
            setCommentWrapper,
          }}
        >
          <CommentsContainer />
          <div className="max-w-[900px] center py-10 max-lg:px-5vw">
            <img src={banner} className="aspect-video" />
            <div className="mt-12 ">
              <h2 className="capitalize">{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    alt=""
                    className="w-12 aspect-square rounded-full "
                  />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link className="underline" to={`/user/${author_username}`}>
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>
            <BlogInteraction blog={blog} />
            {/* blog content */}
            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => {
                return (
                  <div className="my-4 md:my-8" key={i}>
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction blog={blog} />
            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ delay: i * 0.08, duration: 1 }}
                    >
                      {" "}
                      <BlogPostCard
                        content={blog}
                        author={personal_info}
                      />{" "}
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
