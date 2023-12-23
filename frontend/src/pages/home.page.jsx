import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const Homepage = () => {
  let categories = [
    "programmming",
    "hollywood",
    "bollywood",
    "anime",
    "tech",
    "travel",
    "cooking",
    "movies",
  ];
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, SetTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("Home");

  const fetchBlogsByCategory = ({page = 1}) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page
      })
      . then(async({ data }) => {

        let formatedData= await filterPaginationData({
          state:blogs,
          data:data.blogs,
          page,
          countRoute:"/search-blogs-count",
          dataToSend:{tag:pageState}
        })
        setBlogs(formatedData)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLatestBlogs = ({page = 1}) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      . then(async({ data }) => {

        let formatedData= await filterPaginationData({
          state:blogs,
          data:data.blogs,
          page,
          countRoute:"/all-latest-blogs-count"
        })
        setBlogs(formatedData)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTrendingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data: { blogs } }) => {
        SetTrendingBlogs(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (pageState == "Home") {
      fetchLatestBlogs({page:1});
    } else {
      fetchBlogsByCategory({page:1});
    }

    if (!trendingBlogs) fetchTrendingBlog();
  }, [pageState]);

  const loadByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == category) {
      setPageState("Home");
      return;
    }
    setPageState(category);
  };
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* //for latest blog */}
        <div className="w-full">
          <InPageNavigation
            route={[pageState, "Trendings"]}
            defaultHidden={["Trendings"]}
          >
            {/* Next child is for Home */}
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message={"No Blogs Published"} />
              )}
              <LoadMoreDataBtn state={blogs} fetchDataFunc={ (pageState=="Home"?fetchLatestBlogs:fetchBlogsByCategory) } />
            </>

            {/* Next child is for trending */}
            <>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message={"No trending Data"} />
              )}
            </>
          </InPageNavigation>
        </div>
        {/* for filters and trending blog */}
        <div className="min-w[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                {" "}
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadByCategory}
                      key={i}
                      className={
                        "tag " +
                        (pageState == category ? "bg-black text-white" : "")
                      }
                    >
                      {category}{" "}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs == [] ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  )
                })
              ) : (
                <NoDataMessage message={"No Trending Blogs"} />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
