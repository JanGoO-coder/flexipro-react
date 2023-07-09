import React, { useState } from "react";
import "./Login.scss";
import { RadioButton } from "primereact/radiobutton";
import * as Components from "./Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function Login() {
  const [signIn, toggle] = useState(true);
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigateTo = useNavigate();

  const handleNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handlelastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form field validation
    const validationErrors = {};

    if (signIn) {
      if (!email) {
        validationErrors.email = "Email is required";
      }
      if (!password) {
        validationErrors.password = "Password is required";
      }
    } else {
      if (!firstName) {
        validationErrors.firstName = "Name is required";
      }
      if (!lastName) {
        validationErrors.lastName = "Name is required";
      }
      if (!email) {
        validationErrors.email = "Email is required";
      }
      if (!password) {
        validationErrors.password = "Password is required";
      }
      if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
      if (!userType) {
        validationErrors.userType = "User type is required";
      }
    }

    // If there are validation errors, set the errors state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear validation errors
    setErrors({});

    try {
      let response, token;

      if (signIn) {
        // Send a request to the login endpoint
        response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
          email,
          password,
        });
        token = response?.data?.token;
        const decodedToken = jwt_decode(token);
        const userRole = decodedToken.user_role;
        // console.log('userType: ' + userRole)
        // console.log(token);
        localStorage.setItem("token", token);

        userRole == 'company' ? navigateTo('/company-profile') : navigateTo('/profile')

      } else {
        // Send a request to the signup endpoint
        response = await axios.post("http://127.0.0.1:8000/api/auth/register", {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          c_password: confirmPassword,
          user_role: userType,
        });
        console.log("Register", response?.data?.response.token)
        token = response?.data?.response.token;
        localStorage.setItem("token", token);
        toggle(true)
      }


      // Reset form fields and user type
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
    } catch (error) {
      // Handle authentication error, e.g., display an error message
      console.log("Authentication error:", error);
    }
  };

  const handleSignUpClick = () => {
    // Clear form fields and errors
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUserType("");
    setErrors({});
  };

  const handleSignInClick = () => {
    // Clear form fields and errors
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <div className="loginPage">
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleNameChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
            <Components.Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handlelastNameChange}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <Components.Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
            <Components.Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
            <div className="userSelection">
              <div className="userType">
                <RadioButton
                  inputId="Seller"
                  name="user"
                  value="company"
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === "company"}
                />
                <label htmlFor="Seller" className="title">
                  Campany
                </label>
              </div>
              <div className="userType">
                <RadioButton
                  inputId="Buyer"
                  name="user"
                  value="employee"
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === "employee"}
                />
                <label htmlFor="Buyer" className="title">
                  Employee
                </label>
              </div>
            </div>
            {errors.userType && (
              <span className="error">{errors.userType}</span>
            )}
            <Components.Button onClick={handleSubmit}>Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <Components.Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
            <Components.Button onClick={handleSubmit}>Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                Hey team! Hope you will work hard.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => { toggle(true), handleSignUpClick() }}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Professionals!</Components.Title>
              <Components.Paragraph>
                One step ahead, connect with the community.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => { toggle(false), handleSignInClick() }}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
}

export default Login;
