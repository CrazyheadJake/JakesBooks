import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup({ setLogin, setError }: { setLogin: (x: boolean) => void, setError: (x: string) => void}) {
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password1") as string;
        const password2 = formData.get("password2") as string;
        if (password !== password2) {
            setError("Passwords do not match");
            return;
        }
        const name = formData.get("firstName") as string;
        console.log(email, password);

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (res.ok) {
            // Login success
            setLogin(true);
            navigate("/");
        } else {
            // Login failed
            setLogin(false);
            const body = await res.json();
            setError(body.error || "Login failed");
        }
    }
    
    return (
    <>
    <form method="POST" onSubmit={handleSubmit}>
        <h3 style={{textAlign: "center"}}>Sign Up</h3>
        <div className="form-group">
            <label className="required-label" htmlFor="email">Email Address</label>
            <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter email"
                required={true}
        />
        </div>
        <div className="form-group">
            <label className="required-label" htmlFor="firstName">First Name</label>
            <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                required={true}
            />
        </div>
        <div className="form-group">
            <label className="required-label" htmlFor="password1">Password</label>
            <input
                type="password"
                className="form-control"
                id="password1"
                name="password1"
                placeholder="Enter password"
                required={true}
            />
        </div>
        <div className="form-group">
            <label className="required-label" htmlFor="password2">Confirm your Password</label>
            <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                placeholder="Confirm password"
                required={true}

            />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </>
    )
}

export default Signup;