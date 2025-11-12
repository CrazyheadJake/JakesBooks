function Login() {
    return (
        <form method="POST">
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
    )
}

export default Login;