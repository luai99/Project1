import React, { useContext, useState } from "react";
import img from "./Assets/login-removebg-preview.png";
import { Row, Form, Col } from "react-bootstrap";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User } from "./Context";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /.{8,}/;
  const nav = useNavigate();

  const tokenx = useContext(User);
  
  const cookie = new Cookies();

  async function submit(e) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
   
    if (!emailRegex.test(email)) {
      toast.error("Email is not valid");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password should be at least 8 characters long");
      return;
    }

    try {
      let res = await axios.post(
        "http://quizzy-001-site1.atempurl.com/api/Auth/LogIn",
        {
          emailAddress: email,
          password: password,
        }
      );

      if (res.data.success === true) {
        toast.dismiss(toastId);
        

        const tokenres = res.data.data.accessToken;
        const Rtokenres = res.data.data.refreshToken;

        tokenx.auth.token = tokenres;
        tokenx.auth.Rtoken = Rtokenres;
       

        cookie.set("Bearer", tokenres);
        cookie.set("Bearer1", Rtokenres);

        

        nav("/dashboard");

        
      }
    } catch (err) {
      toast.dismiss(toastId);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while login process.");
      }
    }
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  }

  return (
    <>
      
      <div className="logcard position-relative">
        <Row>
          <Col lg={6} md={6} sm={12} xs={12}>
            <img
              src={img}
              alt="Login"
              className="col img-fluid position-absolute"
              style={{
                width: "52%",
                marginTop: "-2%",
                marginLeft: "4%",
              }}
            />
          </Col>
          <Col lg={6} md={6} sm={12} xs={12}>
            <div
              md={6}
              className="col-lg-1 col-md-5 "
              style={{
                marginTop: "150px",
                marginRight: "250px",
                width: "62%",
              }}
            >
              <Form id="Log-In" onSubmit={submit}>
                <div
                  className="login-form border border-0 rounded-5 px-3 py-5 w-100"
                  style={{
                    backgroundColor: "#0d154a",
                    width: "100%",
                    height: "58%",
                    marginLeft: "20%",
                  }}
                >
                  <h1
                    className="text-center display-2 mt-5 mb-4 "
                    style={{ color: "#fff5e5", fontWeight: "bold" }}
                  >
                    Login
                  </h1>
                  <Form.Group className="px-5">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-4 focus"
                      style={{
                        backgroundColor: "#fff5e5",
                        height: "47px",
                      }}
                    />
                  </Form.Group>

                  <div className=" position-relative px-5 mb-1 ">
                    <Form.Group className="">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        className="focus"
                        style={{ backgroundColor: "#fff5e5", height: "47px" }}
                      />
                    </Form.Group>
                    <button
                      className="  position-absolute top-50 end-0 translate-middle-y border-0   "
                      style={{ paddingRight: "20%", marginTop: "-2%" }}
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      <i className="eye-btn fa-regular fa-eye position-absolute"></i>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="login_btn mt-3 border-0 rounded-2"
                    style={{
                      width: "78%",
                      marginLeft: "11%",
                      height: "47px",
                      fontSize: "1.6rem",
                    }}
                  >
                    Login
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}
