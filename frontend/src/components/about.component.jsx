import React from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to read here"}
      </p>
      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];
          return link ? (
            <Link key={key} target="_blank" to={link}>
              {" "}
              <i
                className={`text-2xl hover:text-black fi fi-${
                  key == "website" ? "rr-globe" : "brands-" + key
                }`}
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>
      <p className="text-xl leading-7 text-dark-grey">{getFullDay(joinedAt)}</p>
    </div>
  );
};

export default AboutUser;
