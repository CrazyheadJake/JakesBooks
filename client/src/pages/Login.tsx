import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Login({ setLogin, setError }: { setLogin: (x: boolean) => void, setError: (x: string) => void}) {
    const navigate = useNavigate();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("email") as string;
        const password = formData.get("password") as string;
        console.log(username, password);

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
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
    function resetPassword() {
        navigate("/request-reset");
    }
    return (
        <><form className="m-3" method="POST" onSubmit={handleSubmit}>
            <h3 style={{ textAlign: "center" }}>Login</h3>
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
                <label className="required-label" htmlFor="password">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    required={true}
                />
            </div>
            <br />
            <div className="form-row">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-link ml-3" onClick={resetPassword}>Forgot Password?</button>
            </div>
        </form>
        </>
    )
}

export default Login;