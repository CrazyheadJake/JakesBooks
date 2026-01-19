import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.API_URL;

function ResetPassword({ setError, setLogin }: { setError: (x: string) => void, setLogin: (x: boolean) => void }) {
    const navigate = useNavigate();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const username = urlParams.get("user") || "";
        const token = urlParams.get("token") || "";

        const form = e.currentTarget;
        const formData = new FormData(form);
        const password1 = formData.get("password") as string;
        const password2 = formData.get("confirmpassword") as string;
        if (password1 !== password2) {
            setError("Passwords do not match");
            return;
        }

        const res = await fetch(API_URL + "/api/resetPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password: password1, token: token })
        });

        if (res.ok) {
            // Reset success
            setLogin(true);
            navigate("/");
        } else {
            // Reset failed
            const body = await res.json();
            setError(body.error || "Failed to reset password");
        }
    }
    return (
        <><form className="m-3" method="POST" onSubmit={handleSubmit}>
            <h3 style={{ textAlign: "center" }}>Reset Password</h3>
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
            <div className="form-group">
                <label className="required-label" htmlFor="confirmpassword">Confirm Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="confirmpassword"
                    name="confirmpassword"
                    placeholder="Enter password"
                    required={true}
                />
            </div>
            <br />
            <button type="submit" className="btn btn-primary">Reset Password</button>
        </form>
        </>
    )
}

export default ResetPassword;