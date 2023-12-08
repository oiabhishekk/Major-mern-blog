import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  let { userAuth, setUserAuth } = useContext(UserContext);
  const access_token = userAuth ? userAuth.access_token : "";

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData) //promise
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data)); // data need to be stringfy bcz session dont accept an object
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type == "sign-in" ? "/signin" : "/signup";
    //forming data
    let form = new FormData(formElement);
    const formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { fullname, email, password } = formData;
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    //form validation
    if (fullname && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters long");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 letters long including a numeric,uppercase & a lowercase "
      );
    }
    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = { access_token: user.accessToken };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google");

        console.log(err);
      });
  };

  return access_token ? (
    <Navigate to={"/"} />
  ) : (
    <AnimationWrapper keyvalue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px] ">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "join us today"}
          </h1>
          {type != "sign-in" ? (
            <InputBox
              type="text"
              placeholder="Full Name"
              name="fullname"
              icon="fi fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            type="text"
            placeholder="Email"
            name="email"
            icon="fi fi-rr-envelope"
          />
          <InputBox
            type="password"
            placeholder="password"
            name="password"
            icon="fi fi-rr-key"
            autoComplete="current-password"
          />

          <button onClick={handleSubmit} className="btn-dark center mt-14">
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button
            onClick={handleGoogleAuth}
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center "
          >
            <img className="w-5 " src={googleIcon} alt="" />
            <a>Continue With Google</a>
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link className="underline text-black text-xl ml-1" to="/signup">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link className="underline text-black text-xl ml-1" to="/signin">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
