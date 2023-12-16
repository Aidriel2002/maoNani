import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./signUp.css";

const SignUp = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleNameChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
    validateName(enteredName);
  };

  const handleLastNameChange = (event) => {
    const enteredLastName = event.target.value;
    setLastName(enteredLastName);
    validateName(enteredLastName);
  };

  const validateName = (enteredValue) => {
    const containsNumber = /\d/.test(enteredValue);
    if (containsNumber) {
      setMessage("Name cannot contain numbers.");
      updateMessageStyle("#f0356a");
      return false;
    } else {
      setMessage("");
      return true;
    }
  };

  const updateMessageStyle = (color) => {
    const errorMessageElement = document.getElementById("screated");
    if (errorMessageElement) {
      errorMessageElement.style.color = color;
      errorMessageElement.style.padding = "5px 40px";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = email;

    if (password !== confirmPassword) {
      setMessage("Password do not match.");
      updateMessageStyle("#f0356a");
      return;
    }
    if (password.length < 8) {
      setMessage("Passwords must have at least 8 characters.");
      updateMessageStyle("#f0356a");
      return;
    }

    if (password.length > 16) {
      setMessage("Password maximum of 16 characters.");
      updateMessageStyle("#f0356a");
      return;
    }

    const isNameValid = validateName(name);
    const isLastNameValid = validateName(lastName);

    if (!isNameValid || !isLastNameValid) {
      return;
    }

    createUserWithEmailAndPassword(auth, userEmail, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            resetForm();
            setMessage("Account successfully created.");
            updateMessageStyle("green");
          })
          .catch((updateProfileError) => {
            console.error("Error updating profile:", updateProfileError);
            setMessage("An error occurred. Please try again.");
            updateMessageStyle("#f0356a");
          });
      })
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          setMessage("Invalid Email.");
        } else if (err.code === "auth/email-already-in-use") {
          setMessage("Email already in use.");
        } else {
          setMessage("An error occurred. Please try again.");
        }

        updateMessageStyle("#f0356a");
        console.log(err);
      });
  };

  return (
    <div className="sform-container">
      <div className="loginForm">
        <h3 className="signUp">Create Account</h3>
        <p className="scaption">I'm happy to see you here!</p>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="sinputBox">
            <input
              name="fname"
              value={name}
              className="name"
              onChange={handleNameChange}
              required
            />
            <span>First Name</span>
          </div>
          <div className="sinputBox">
            <input
              name="fname"
              value={lastName}
              className="name"
              onChange={handleLastNameChange}
              required
            />
            <span>Last Name</span>
          </div>
          <div className="sinputBox">
            <input
              className="semail-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span>Enter your email</span>
          </div>
          <div style={{ display: "flex" }}>
            <div className="sinputBox">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="spw-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span>Password</span>
            </div>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="seye-icon"
              
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="sinputBox">
            <input
              type={showPassword ? "text" : "password"}
              name="fname"
              value={confirmPassword}
              className="spw-box"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span>Confirm Password</span>
          </div>
          <button type="submit" className="signup-button">
            <b>Sign Up</b>
          </button>
        </form>
      </div>
      <p id="screated">{message}</p>
    </div>
  );
};

export default SignUp;
