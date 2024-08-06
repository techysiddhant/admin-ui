const LoginPage = () => {
    return (
        <>
            <h1>Sign in</h1>
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Password" />
            <label htmlFor="remember-me">Remember me</label>
            <input type="checkbox" placeholder="Remember me" id="remember-me" />
            <button>Log in</button>
            <a href="#">Forgot password</a>
        </>
    )
}

export default LoginPage