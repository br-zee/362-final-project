import "./Login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../makeRequest";
import { useState } from "react";

export default function Login() {

    const navigate = useNavigate();

    const [error, setError] = useState({});
    const [success, setSuccess] = useState({});

    function handleLogIn(e) {
        e.preventDefault();
        const user = e.target.username.value;
        const pass = e.target.password.value;

        makeRequest.post(`/auth/local`, {
            identifier: user,
            password: pass,
        })
        .then(response => {
            Cookies.set("sessionId", response.data.jwt, { expires: 7 });
            navigate("/profile");
        })
        .catch(error => {
            if (error.response?.status == 400) {
                console.log('invalid credentials');
            }
        });
    }

    function handleSignUp(e) {
        e.preventDefault();
        setSuccess({});
        setError({});
        
        const email = e.target.email.value;
        const user = e.target.username.value;
        const pass = e.target.password.value;

        makeRequest.post("/auth/local/register", {
            username: user,
            email: email,
            password: pass,
        })
        .then(res => setSuccess({
            msg: "Success! Please log in with your credentials."
        }))
        .catch(err => setError({
            msg: "Error: please try again later."
        }))
    }

    return (
        <div className="login-content">
            <form className="login-form" action="/profile" method="POST" onSubmit={handleLogIn}>
                <fieldset>
                    <legend><h1>Log In</h1></legend>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="login-username" />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="login-password" />
                    <input type="submit" value="Log In" />
                </fieldset>
            </form>

            <form className="signup-form" action="" method="POST" onSubmit={handleSignUp}>
                <fieldset>
                    <legend><h1>Sign Up</h1></legend>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="signup-email" placeholder="example@email.com" />
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="signup-username" />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="signup-password" />
                    <input type="submit" value="Sign Up" />
                    {success && <p>{success?.msg}</p>}
                    {error && <p>{error?.msg}</p>}
                </fieldset>
            </form>
        </div>
    )
}