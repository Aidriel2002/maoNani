import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./signIn.css";
import SignUp from "./SignUp";
import Modal from "./Modal.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Footer from "../../footer/Footer.jsx";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    console.log("Closing SignUp Modal");
    setShowSignUpModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = email;

    if (password.length < 8) {
      setMessage("Passwords must have at least 8 characters.");
      const errorMessageElement = document.getElementById("created");
      errorMessageElement.style.color = "red";
      return;
    }

    signInWithEmailAndPassword(auth, userEmail, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        setMessage("Invalid Email or Password.");
        const errorMessageElement = document.getElementById("created");
        errorMessageElement.style.color = "red";
        errorMessageElement.style.padding = "5px 40px";
        console.log(error);
      });
  };

  return (
    <>

        <div id="header">
          <div className="left-header">
            <img className="logo" src="./logo.png"  alt="Logo" draggable="false"/>
            <h1>
              Organize your daily task and say <span>goodbye </span>
              <br /> to missed deadlines.
            </h1>
          </div>
          <div className="form-container">
              <h3 className="login">Login</h3>
              <p className="caption">Hello! Let's get started</p>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="space">
                  <div className="inputBox">
                    <input  className="email-box" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <span>Enter your email</span>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div className="inputBox">
                      <input name="password" type={showPassword ? "text" : "password"} className="pw-box" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <span>Password</span>
                    </div>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}  className="eye-icon" style={{position: "absolute",  margin: "29px 330px", cursor: "pointer",}} onClick={() => setShowPassword(!showPassword)} />
                </div>
                  <p className="adjust-forgot-pw" onClick={openModal}>
                    Forgot Password?
                  </p>   
                  <button type="submit" className="login-button"> <b>Log In</b> </button>
                <p className="signup"> Don't have an account?{" "}<span onClick={openSignUpModal}>Sign Up</span> </p>
                <p id="created">{message}</p>
              </form>
              
            </div>
            
          </div>            

          {showSignUpModal && (
            <Modal onClose={closeSignUpModal}>
              <SignUp />
            </Modal>
          )}
          {showModal && (
            <Modal onClose={closeModal}>
              <ForgotPassword />
            </Modal>
          )}

      <Footer />
    </>
  );
};

export default SignIn;