import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Utils from "../Utils"

function RequestPasswordReset({ setError }: { setError: (x: string) => void}) {
    const [ message, setMessage ] = useState("");
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const submitButton = form.querySelector("[type=submit]")
        submitButton?.setAttribute("disabled", "true");

        const res = await fetch("/api/requestPasswordReset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            Utils.addAlert("Password reset email has been sent", setMessage, "alert-primary")
        } else {
            const body = await res.json();
            setError(body.error || "Login failed");
        }
        submitButton?.removeAttribute("disabled");
    }
    return (
        <>
        <div id="alertPlaceholder">
        </div>
        <form className="m-3" method="POST" onSubmit={handleSubmit}>
            <h3 style={{ textAlign: "center" }}>Password Reset</h3>
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

            <br />
            <div className="form-row">
                <button type="submit" className="btn btn-primary">Request Password Reset</button>
            </div>
        </form>
        </>
    )
}

export default RequestPasswordReset;