import { useState, useEffect } from 'react'

function Login({ setLogin }: { setLogin: (x: boolean) => void }) {
    const [error, setError] = useState("");
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
            window.location.href = "/";
        } else {
            // Login failed
            setLogin(false);
            const body = await res.json();
            setError(body.error || "Login failed");
        }
    }
    return (
        <><form method="POST" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
        </div></>
    )
}

export default Login;