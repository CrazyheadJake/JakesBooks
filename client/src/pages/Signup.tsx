function Signup() {
    return (
    <form method="POST">
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
    )
}

export default Signup;