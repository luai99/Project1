import React from "react";
import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { User } from "../Context";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

export default function UpdateModal({
  show,
  title,
  Email,
  user,
  setUser,
  setEmail,
  phone,
  setPhone,
  clas,
  setClass,
  onCloseclick,
  onClose,
  onsaveclick,
  SaveChanges,
  handleFileChange,
  handleFileChange1,
  img,
  setimg,
  cv,
  setCv,
  fileInputRef,
  handleImageClick,
}) {
  return (
    <>
      <Modal show={show} onHide={onCloseclick}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#850a6d",
            borderColor: "#850a6d",
            onHide: { backgroundColor: "red" },
          }}
        >
          <Modal.Title className=" text-light">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#0c1243" }}>
          <Form type="submit">
            <div className="d-flex" style={{ marginLeft: "-80px" }}>
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
                  src={img && URL.createObjectURL(img)}
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
                className=""
                style={{
                  marginTop: "5%",
                  marginLeft: "5%",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                {img ? img.name : "Upload Photo"}
              </span>
            </div>

            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="UserName"
                style={{ width: "50%" }}
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Email"
                style={{ width: "50%" }}
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex flex-row ">
              <input
                className="focus3"
                controlId="exampleForm.ControlInput1"
                readOnly
                type="text"
                placeholder="+963"
                style={{
                  width: "10%",
                  borderRadius: "12%",
                  paddingLeft: "1%",
                  marginRight: "3%",
                  marginTop: "0.2%",
                  height: "46px",
                }}
              ></input>

              <Form.Group className="" controlId="exampleForm.ControlInput1">
                <Form.Label></Form.Label>
                <Form.Control
                  required
                  type="text"
                  inputMode="numeric"
                  placeholder="Phone Number"
                  style={{
                    width: "100%",
                    marginTop: "-10.5%",
                    marginLeft: "-6%",
                  }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Class"
                style={{ width: "50%" }}
                value={clas}
                onChange={(e) => setClass(e.target.value)}
              />
            </Form.Group>

            <div className="Modalcv">
              <i
                className="fa-solid fa-cloud-arrow-up"
                style={{
                  color: "white",
                  fontSize: "400%",
                  marginTop: "7%",
                }}
              ></i>
              <span
                className="text-light "
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "20px",
                  marginTop: "32%",
                  marginLeft: "25%",
                  position: "absolute",
                  left: "0%",
                  top: "22%",
                  width: "0px",
                }}
              >
                {cv ? (
                  <>
                    Done
                    <i
                      class="fa-solid fa-file-circle-check"
                      style={{
                        marginLeft: "35px",
                        color: "#d130b2",
                      }}
                    ></i>
                  </>
                ) : (
                  " "
                )}
              </span>

              <label
                className="rounded-3 border-0 login_btn"
                style={{
                  width: "70%",
                  height: "43px",
                  marginTop: "40%",
                  marginLeft: "0%",
                  paddingLeft: "11%",
                  paddingTop: "4%",
                  marginBottom: "0%",
                  color: "white",
                  fontSize: "17px",
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
          </Form>
          <div className="" style={{ marginLeft: "27%", marginTop: "10%" }}>
            <Button
              variant="secondary"
              onClick={onCloseclick}
              style={{
                marginRight: "20px",
                backgroundColor: "#232747",
                borderColor: "#232747",
              }}
            >
              {onClose}
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={onsaveclick}
              style={{
                marginLeft: "20px",
                backgroundColor: "#850a6d",
                borderColor: "#850a6d",
              }}
            >
              {SaveChanges}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}
