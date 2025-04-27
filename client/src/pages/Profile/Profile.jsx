import "./Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
    const sessionId = Cookies.get("sessionId");

    const navigate = useNavigate();
    if (!sessionId) navigate("/login");

    function fetchUserData() {
        let user = JSON.parse(localStorage.getItem("data"));

        if (user == null) {
            let { user, loading, error } = useAuth(sessionId);
            localStorage.setItem("data", JSON.stringify(user));
            return user;
        } 
        return user;
    }

    const user = fetchUserData();

    function handleLogOut() {
        Cookies.remove("sessionId");
        localStorage.removeItem("data");
        navigate("/login");
    }

    return (
        <div>
            <div className="greeting">
                <h1>Hello</h1>
                <p>{user?.name || user?.username}</p>
            </div>
            <div className="links">
                <button onClick={() => navigate("")}><p>Manage Orders</p></button>

                { user?.role?.type === 'authenticated' &&
                    <button onClick={() => navigate("admin")}><p>Admin</p></button>
                }

                <button onClick={handleLogOut}><p>Log out</p></button>
            </div>
        </div>
    )
}