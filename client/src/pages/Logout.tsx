import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Logout({ setLogin }: { setLogin: (x: boolean) => void }) {
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/api/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        setLogin(false);
        navigate("/login");
    }, []);
    return null;
}

export default Logout;