import React, { useEffect, useRef, useState } from "react";
const InPageNavigation = ({
  route,
  children,
  defaultActiveIndex = 0,
  defaultHidden,
}) => {
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
  const activeTabLineRef = useRef();
  let activeTabRef = useRef();

  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
    setInPageNavIndex(i);
  };
  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, [route]);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {route.map((rout, i) => {
          return (
            <button
              ref={i == defaultActiveIndex ? activeTabRef : null}
              onClick={(e) => changePageState(e.target, i)}
              key={i}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex == i ? "text-black " : "text-dark-grey ") +
                (defaultHidden.includes(rout) ? "md:hidden" : "")
              }
            >
              {rout}
            </button>
          );
        })}
        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
