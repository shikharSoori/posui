import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import { errorFunction, successFunction } from "../../Components/Alert/Alert";
import CommonTextField from "../../Components/CommonTextField";

import logo from "../../assets/nmb-logo.webp";
import soorilogo from "../../assets/soorilogo.png";
import loginImage from "./../../assets/login-image.png";

import { login } from "../../Redux/Auth/thunk";

import Button from "../../Components/Buttons/Button";

import "./login.css";

const Login = () => {
  const [type, setType] = useState("password");
  const remember = localStorage.getItem("rememberMe");
  const user = localStorage.getItem("userName");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    userName: user ? user : "",
    password: "",
    rememberMe: remember === "true" ? true : false,
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .required("Required!")
      .min(3, "Username must be at least 3 characters.")
      .matches(
        /(?=.*^[A-Za-z_]\w).*$/,
        "Username should begin with _ or alphabet."
      ),
    password: Yup.string()
      .required("Required!")
      .min(4, "Password should be at least 4 characters."),
    rememberMe: Yup.bool(),
  });

  const onSubmit = async (values) => {
    try {
      const { rememberMe, userName, password } = values;

      const data = {
        username: userName,
        password: password,
      };

      localStorage.setItem("rememberMe", rememberMe);
      localStorage.setItem("userName", rememberMe ? userName : "");

      dispatch(login(data))
        .unwrap()
        .then(() => {
          setLoading(false);
          successFunction("Logged in successfully.");
        })
        .catch((error) => {
          setLoading(false);
          errorFunction("Failed to log in.");
        });
    } catch (error) {
      setLoading(false);
      errorFunction("Authentication error occurred.");
      console.error("Authentication error:", error);
    }
  };

  const togglePassword = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="content-wrapper d-flex flex-column  justify-content-between align-items-center">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="logo">
              {/* <img
                src={logo}
                width={200}
                height={50}
                style={{ objectFit: "cover" }}
                alt="logo"
              /> */}
            </div>
            {/* <div className="terms-condition">Terms and condition</div> */}
          </div>
          <div className="login-container text-center">
            <h1 className="mb-0">Welcome</h1>
            <h5>To POS</h5>
            <p className="mb-4 welcome-text-small">Login into your account</p>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form>
                    <CommonTextField
                      value={formik.values.userName}
                      labelClassname={"d-none"}
                      type={"text"}
                      name={"username"}
                      className={"login mt-3"}
                      // required
                      placeholder={"Username"}
                      onChange={(e) =>
                        formik.setFieldValue("userName", e.target.value)
                      }
                    />
                    <div className="password-field">
                      <CommonTextField
                        labelClassname={"d-none"}
                        type={type}
                        name={"password"}
                        className={"login mt-3"}
                        // required
                        placeholder={"Password"}
                        onChange={(e) =>
                          formik.setFieldValue("password", e.target.value)
                        }
                      />
                      <span className="fa-eye-button" onClick={togglePassword}>
                        {type === "password" ? (
                          <BsFillEyeSlashFill />
                        ) : (
                          <BsFillEyeFill />
                        )}
                      </span>
                    </div>

                    <div className=" d-flex justify-content-between remember-forget-container mt-3">
                      <div className="form-check">
                        <Field
                          type="checkbox"
                          className="form-check-input"
                          name="rememberMe"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="w-100 mt-3">
                      <Button
                        btnType="submit"
                        className="btn create-button justify-content-center align-items-center w-100"
                        title="Log In"
                        content="Log In"
                        disabled={loading}
                        loading={loading}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="developer-content text-center ">
            <p>Developed and Maintained By</p>
            <img src={soorilogo} alt="soori-logo" />
          </div>
        </div>
        <div className="image-wrapper">
          <img src={loginImage} alt="login" />
        </div>
      </div>
    </>
  );
};

export default Login;
