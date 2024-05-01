import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { User } from "./Context";
import ReactPaginate from "react-paginate";
import CustomModal from "./Coponents/Modal";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import UpdateModal from "./Coponents/UpdateModal";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [dataSize, setdataSize] = useState(0);
  const pageSize = 6;

  const [search, setsearch] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showupdateModal, setShowupdateModal] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserId2, setSelectedUserId2] = useState(null);
  const tokenx = useContext(User);
  const nav = useNavigate();

  const [user, setUser] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  let formattedPhoneNumber = "+963" + phone;
  const [clas, setClass] = useState("");
  const [img, setimg] = useState("");
  const [cv, setcv] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    setimg(e.target.files[0]);
  }

  function handleFileChange1(e) {
    setcv(e.target.files[0]);
  }

  const handleImageClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  //===================================================
  const fetchUsers = async (search, page, pageSize) => {
    const toastId = toast.loading("Loading...");
    try {
      const token2 = tokenx.auth.token;
      const response = await axios.get(
        `https://quizzy-001-site1.atempurl.com/api/Auth/get-teachers?SearchQuery=${search}&PageIndex=${page}&PageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token2}`,
            accept: "*/*",
          },
        }
      );
      if (response.data.dataSize === 0) {
        toast.dismiss(toastId);
        toast.error("No results found");
        setUsers([]);
      } else {
        toast.dismiss(toastId);
        setdataSize(response.data.dataSize);
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.dataSize / pageSize));
      }
    } catch (err) {
      toast.dismiss(toastId);
      if (err.response && err.response.status === 401) {
        RefreshToken();
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchUsers(search, page, pageSize);
  }, [page, tokenx]);

  const handlePageClick = ({ selected }) => {
    const toastId = toast.loading("Loading...");
    const pageNumber = selected;
    setPage(pageNumber);
    toast.dismiss(toastId);
  };

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const openupdateModal = (userId) => {
    setSelectedUserId2(userId);
    setShowupdateModal(true);
  };

  async function handleDeleteConfirmation() {
    const toastId = toast.loading("Loading...");
    try {
      const token2 = tokenx.auth.token;
      const response = await axios.post(
        `https://quizzy-001-site1.atempurl.com/api/Auth/post-delete-user/${selectedUserId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token2}`,
            accept: "*/*",
          },
        }
      );

      if (response.data.success === true) {
        toast.dismiss(toastId);

        setShowModal(false);
        fetchUsers(search, page, pageSize);
        toast.success("Teacher Deleted Successfully");
      }
    } catch (err) {
      toast.dismiss(toastId);
      if (err.response && err.response.status === 401) {
        await RefreshToken();
        handleDeleteConfirmation();
      } else {
        console.error(err);
      }
    }
  }
  //======================================
  async function Update() {
    const toastId = toast.loading("Loading...");
    const token2 = tokenx.auth.token;
    if (!emailRegex.test(Email)) {
      toast.dismiss(toastId);
      toast.error("Email is not valid");
      return;
    }

    if (phone.startsWith("0")) {
      toast.dismiss(toastId);
      toast.error("Number must not start with 0");
      return; // Exit the function early
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
      formData.append("Email", Email);
      formData.append("PhoneNumber", formattedPhoneNumber);
      formData.append("ClassName", clas);
      formData.append("image", img);
      formData.append("Cv", cv);

      const res = await axios.put(
        `https://quizzy-001-site1.atempurl.com/api/Auth/update-teacher/${selectedUserId2}`,
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

        setShowupdateModal(false);
        fetchUsers(search, page, pageSize);
        toast.success("Teacher Updated Successfully");

        setUser("");
        setEmail("");
        setPhone("");
        setClass("");
        setimg("");
        setcv("");
      }
    } catch (err) {
      toast.dismiss(toastId);
      if (err.response && err.response.status === 401) {
        await RefreshToken();
        Update();
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while update teacher info");
      }
    }
  }
  //==================================================
  async function RefreshToken() {
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
        fetchUsers(search, page, pageSize);
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

  const handleSearch = () => {
    const toastId = toast.loading("Loading...");
    fetchUsers(search, page, pageSize);
    toast.dismiss(toastId);
  };

  const handleclear = () => {
    const toastId = toast.loading("Loading...");
    setsearch("");
    setPage(0);
    setShowClearButton(false);
    fetchUsers("", 0, pageSize);
    toast.dismiss(toastId);
  };

  const onCloseUpdateclick = () => {
    setUser("");
    setEmail("");
    setPhone("");
    setClass("");
    setimg("");
    setcv("");
    setShowupdateModal(false);
  };

  async function handleLogout() {
    const cookie = new Cookies();
    try {
      cookie.remove("Bearer");
      cookie.remove("Bearer1");
      tokenx.auth.token = null;
      tokenx.auth.Rtoken = null;
      nav("/", { replace: true });
      window.history.replaceState(null, "", "/");
      window.addEventListener("popstate", function (event) {
        window.location.href = "/";
      });
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
        <div className="HomeCard rounded-4 ">
          <button className="home border-0">
            <i className="fa-solid fa-house-user home-icon"></i>
            <span className="home-text" style={{ fontWeight: "bold" }}>
              Home
            </span>
          </button>
          <Link to="/AddTeacher" className="addteacher border-0">
            <i className="fa-solid fa-circle-plus home-icon"></i>
            <span className="add-text ">Add Teacher</span>
          </Link>
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
        <div className="search">
          <div className="input-group">
            <div className="input-group-append rounded-start-2">
              <button className="btn" type="button" onClick={handleSearch}>
                <i className="fa fa-search"></i>
              </button>
            </div>
            <input
              type="text"
              className="form-control rounded-end-2"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
                setShowClearButton(e.target.value.length > 0);
              }}
            />
            {showClearButton && (
              <button className="x-btn" onClick={handleclear}>
                <i className="fa-regular fa-rectangle-xmark eye-btn xx-btn "></i>
              </button>
            )}

            <div className="total-member">
              <label className="">Total Member </label>
              <span className="member-number">{dataSize}</span>
            </div>
          </div>
        </div>

        <div className="containerx">
          <div className="labels">
            <span className="text-light Photo-label ">Photo</span>
            <span className="text-light fullname-label">Full Name</span>
            <span className="text-light phone-label">Phone</span>
            <span className="text-light class-label">Class</span>
            <span className="text-light cv-label">Cv</span>
            <span className="text-light">Operations</span>
          </div>
          <div className="teachers rounded-4">
            <table>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ paddingLeft: "4.5%" }}>
                      <img
                        src={`http://quizzy-001-site1.atempurl.com/${user.imageUrl}`}
                        style={{
                          width: "10vw",
                          height: "10vw",
                          maxWidth: "50px",
                          maxHeight: "50px",
                          borderRadius: "50%",
                          objectFit:
                            "cover" /* Maintain aspect ratio and cover container */,
                        }}
                        alt=""
                      />
                    </td>

                    <td style={{ paddingLeft: "55px" }}>{user.userName}</td>
                    <td style={{ paddingLeft: "12px" }}>{user.phoneNumber}</td>
                    <td
                      style={{
                        paddingRight: "68px",
                      }}
                    >
                      {user.class}
                    </td>
                    <td style={{ paddingRight: "103px" }}>
                      <a
                        href={`https://quizzy-001-site1.atempurl.com/files/${user.cvFileName}`}
                        target="_blank"
                        rel="noreferrer"
                        download=""
                      >
                        <i className="fa-solid fa-file-pdf pdf-btn"></i>
                      </a>
                    </td>
                    <td style={{ paddingRight: "20px" }}>
                      <button
                        type="button"
                        className="btn-op"
                        onClick={() => openupdateModal(user.id)}
                      >
                        <i className="fa-solid fa-pen edit-btn"></i>
                      </button>
                    </td>
                    <td style={{ paddingRight: "92px" }}>
                      <button
                        type="button"
                        className="btn-op"
                        onClick={() => openModal(user.id)}
                      >
                        <i className="fa-solid fa-xmark delete-btn"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination pagination-style "}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
      <CustomModal
        launchButtonText="Delete"
        modalTitle="Delete Confirmation"
        modalMessage="Are you sure you want to delete this teacher?"
        closeButtonLabel="Cancel"
        saveChangesButtonLabel="Delete"
        onCloseButtonClick={() => setShowModal(false)}
        onSaveChangesButtonClick={handleDeleteConfirmation}
        show={showModal}
      />

      <UpdateModal
        show={showupdateModal}
        onCloseclick={onCloseUpdateclick}
        title={"Update Teacher Information: "}
        onClose={"Cancel"}
        SaveChanges={"Save Changes"}
        handleFileChange={handleFileChange}
        handleFileChange1={handleFileChange1}
        img={img}
        setimg={setimg}
        user={user}
        setUser={setUser}
        Email={Email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        clas={clas}
        setClass={setClass}
        cv={cv}
        setCv={setcv}
        onsaveclick={Update}
        fileInputRef={fileInputRef}
        handleImageClick={handleImageClick}
      />

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}
