import React from "react";
import pageNotFoundImage from "../imgs/404.png";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-2">
          Oops! Looks like you're lost.
        </p>
        <p className="text-gray-600 mb-4">
          The page you are looking for might be under construction or does not
          exist.
        </p>
        <img
          src={pageNotFoundImage}
          alt="Lost astronaut"
          className=" max-w-md mx-auto mb-4 select-none border-2 border-grey w-72 aspect-square object-cover rounded"
        />
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-black px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        >
          Go Back
        </button>
        <a
          href="/"
          className="bg-gray-500 text-black px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
