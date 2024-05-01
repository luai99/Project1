import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { User } from "./Context";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";

export default function AddTeacher() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [clas, setClass] = useState("");
  const [img, setimg] = useState("");
  const [cv, setcv] = useState("");

  const fileInputRef = useRef(null);

  const tokenx = useContext(User);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  const passwordRegex = /.{8,}/;

  const nav = useNavigate();

  function handleFileChange(e) {
    setimg(e.target.files[0]);
  }

  function handleFileChange1(e) {
    setcv(e.target.files[0]);
  }
  const handleImageClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  async function submit(e) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const token2 = tokenx.auth.token;

    let formattedPhoneNumber = "+963" + phone;

    if (!emailRegex.test(email)) {
      toast.dismiss(toastId);
      toast.error("Email is not valid");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.dismiss(toastId);
      toast.error("Password should be at least 8 characters long");
      return;
    }

    if (cpassword !== password) {
      toast.dismiss(toastId);
      toast.error("Password and confirmation password must be the same");
      return;
    }

    if (phone.startsWith("0")) {
      toast.dismiss(toastId);
      toast.error("Number must not start with 0");
      return;
    }

    if (phone.length !== 9) {
      toast.dismiss(toastId);
      toast.error("Number must be 9 digits long");
      return;
    }
    if (!img) {
      toast.dismiss(toastId);
      toast.error("You Must Upload Teacher Photo");
      return;
    }

    if (!cv) {
      toast.dismiss(toastId);
      toast.error("You Must Upload Teacher Cv");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("UserName", user);
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("PhoneNumber", formattedPhoneNumber);
      formData.append("ClassName", clas);
      formData.append("Image", img);
      formData.append("Cv", cv);

      const res = await axios.post(
        "https://quizzy-001-site1.atempurl.com/api/Auth/add-teacher",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token2}`,
            accept: "*/*",
          },
        }
      );

      if (res.data.success === true) {
        toast.dismiss(toastId);
        toast.success(res.data.message);

        setUser("");
        setEmail("");
        setPassword("");
        setCPassword("");
        setPhone("");
        setClass("");
        setimg("");
        setcv("");
      }
    } catch (err) {
      toast.dismiss(toastId);
      if (err.response && err.response.status === 401) {
        RefreshToken(e);
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while adding a new teacher");
      }
    }
  }

  async function RefreshToken(e) {
    const cookie = new Cookies();
    const gettoken = cookie.get("Bearer");
    const getrtoken = cookie.get("Bearer1");

    try {
      const response = await axios.post(
        "https://quizzy-001-site1.atempurl.com/api/Auth/refresh-token",
        {
          accessToken: gettoken,
          refreshToken: getrtoken,
        }
      );
      if (response.data.success === true) {
        cookie.set("Bearer", response.data.data.accessToken);
        cookie.set("Bearer1", response.data.data.refreshToken);

        tokenx.auth.token = response.data.data.accessToken;
        tokenx.auth.Rtoken = response.data.data.refreshToken;
        console.log(tokenx);

        submit(e);
      }
    } catch (err) {
      toast.error("This Session Is End!...Please LogIn Again!");
      cookie.remove("Bearer");
      cookie.remove("Bearer1");
      tokenx.auth.token = null;
      tokenx.auth.Rtoken = null;

      window.history.pushState(null, "", "/");
      nav("/", { replace: true });
    }
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  }

  function togglePasswordVisibility2() {
    const passwordInput = document.getElementById("password2");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  }

  async function handleLogout() {
    const cookie = new Cookies();
    try {
      cookie.remove("Bearer");
      cookie.remove("Bearer1");
      tokenx.auth.token = null;
      tokenx.auth.Rtoken = null;

      window.history.pushState(null, "", "/");
      nav("/", { replace: true });
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div className="Dashboard" style={{ minWidth: "1500px" }}>
      <div className="background1">
        <div className="SideBar d-flex">
          <div className="circle-avatar">
            <span className="avatar-text">L</span>
          </div>
          <p className="name">Luai AbuShaar</p>
        </div>
        <p className="UserEmail">Abushaarluai@gmail.com</p>
        <div className="HomeCard rounded-4">
          <Link to="/Dashboard" className="home border-0">
            <i className="fa-solid fa-house-user home-icon"></i>
            <span className="home-text ">Home</span>
          </Link>
          <button className="addteacher border-0">
            <i className="fa-solid fa-circle-plus home-icon"></i>
            <span className="add-text" style={{ fontWeight: "bold" }}>
              Add Teacher
            </span>
          </button>
          <Link to="/Students" className="student border-0 ">
            <i className="fa-solid fa-users home-icon "></i>
            <span className="students-text">Students</span>
          </Link>
        </div>
        <button className="logout border-0" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket home-icon"></i>
          <span className="logout-text">Logout</span>
        </button>
      </div>
      <div className="background2">
        <label
          className=""
          style={{
            marginLeft: "38%",
            marginTop: "3%",
            fontWeight: "bold",
            fontSize: "35px",
            color: "#fff5e5",
          }}
        >
          Add Member
        </label>
        <form onSubmit={submit}>
          <div className="d-flex">
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {img ? (
              <img
                src={URL.createObjectURL(img)}
                alt="Uploaded"
                className="circle-photo bg-light"
                style={{ cursor: "pointer", width: "70px", height: "70px" }}
                onClick={handleImageClick}
              />
            ) : (
              <label
                htmlFor="fileInput"
                className="circle-photo bg-light"
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fa-solid fa-camera"
                  style={{ fontSize: "30px" }}
                ></i>
              </label>
            )}
            <span
              className="text-light"
              style={{ marginTop: "3.5%", marginLeft: "2%", fontSize: "20px" }}
            >
              {img ? img.name : "Upload Photo"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="focus2 border-light rounded-3"
              style={{
                height: "50px",
                marginLeft: "15%",
                marginTop: "2.5%",
                width: "28%",
              }}
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus2 border-light rounded-3"
              style={{
                height: "50px",
                marginLeft: "15%",
                marginTop: "2%",
                width: "28%",
              }}
            />
            <div
              className="position-relative "
              style={{ marginLeft: "0%", width: "100%" }}
            >
              <input
                type="password"
                autoComplete="off"
                placeholder="Password"
                required
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="focus2 border-light rounded-3"
                style={{
                  height: "50px",
                  marginLeft: "15%",
                  marginTop: "2%",
                  width: "28%",
                }}
              />

              <button
                className="position-absolute top-50 end-0 translate-middle-y border-0"
                style={{
                  paddingRight: "20%",
                  marginRight: "40%",
                  marginTop: "0.5%",
                }}
                type="button"
                onClick={togglePasswordVisibility}
              >
                <i className="eye-btn fa-regular fa-eye position-absolute"></i>
              </button>
            </div>
            <div
              className="position-relative "
              style={{ marginLeft: "0%", width: "100%" }}
            >
              <input
                type="password"
                autoComplete="off"
                placeholder="Confirm Password"
                required
                value={cpassword}
                id="password2"
                onChange={(e) => setCPassword(e.target.value)}
                className="focus2 border-light rounded-3"
                style={{
                  height: "50px",
                  marginLeft: "15%",
                  marginTop: "2%",
                  width: "28%",
                }}
              />

              <button
                className="position-absolute top-50 end-0 translate-middle-y border-0"
                style={{
                  paddingRight: "20%",
                  marginRight: "40%",
                  marginTop: "0.5%",
                }}
                type="button"
                onClick={togglePasswordVisibility2}
              >
                <i className="eye-btn fa-regular fa-eye position-absolute"></i>
              </button>
            </div>
            <div className="d-flex w-100">
              <input
                readOnly
                type="text"
                placeholder="+963"
                className="focus2 border-light rounded-3"
                id="color"
                style={{
                  height: "50px",
                  marginLeft: "15%",
                  marginTop: "2%",
                  width: "7%",
                }}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="focus2 border-light px-4 rounded-3"
                style={{
                  height: "50px",
                  marginLeft: "1%",
                  marginTop: "2%",
                  width: "20%",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Class"
              required
              value={clas}
              onChange={(e) => setClass(e.target.value)}
              className="focus2 border-light rounded-3"
              style={{
                height: "50px",
                marginLeft: "15%",
                marginTop: "2%",
                width: "28%",
              }}
            />
            <div
              className="border-2 rounded-4"
              style={{
                display: "flex",
                flexDirection: "column",
                borderStyle: "dashed",
                marginLeft: "60%",
                marginRight: "10%",
                marginTop: "-38.5%",
                width: "30%",
                height: "100%",
                backgroundColor: "#0c1243",
                borderColor: "#4c4d57",
                position: "relative",
              }}
            >
              <i
                className="fa-solid fa-cloud-arrow-up"
                style={{
                  color: "white",
                  fontSize: "600%",
                  marginLeft: "33%",
                  marginTop: "25%",
                }}
              ></i>
              <span
                className="text-light d-inline-block"
                style={{
                  fontSize: "20px",

                  marginTop: "56%",
                  marginBottom: "-15%",
                  position: "absolute",
                  left: "48%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  width: "100px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {cv ? (
                  <>
                    Done
                    <i
                      class="fa-solid fa-file-circle-check"
                      style={{ marginLeft: "20%", color: "#d130b2" }}
                    ></i>
                  </>
                ) : (
                  " "
                )}
              </span>

              <label
                className="rounded-3 border-0 login_btn"
                style={{
                  width: "53%",
                  height: "50px",
                  marginTop: "20%",
                  marginLeft: "23.5%",
                  paddingLeft: "12%",
                  paddingTop: "3%",
                  marginBottom: "16%",
                  color: "white",
                  fontSize: "18px",
                  position: "relative",
                }}
              >
                Upload CV
                <input
                  type="file"
                  id="fileInput2"
                  onChange={handleFileChange1}
                  accept=".doc, .docx, .pdf, .rtf"
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <button
              className="rounded-3 border-0 login_btn"
              type="submit"
              style={{
                width: "12%",
                height: "50px",
                marginTop: "4%",
                marginLeft: "69%",
                marginBottom: "0%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ADD
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
