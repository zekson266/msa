export default function LoginForm() {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <form className="border p-4 rounded">
          <h3 className="text-center">Login</h3>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" id="password" />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100">
            Login
          </button>
        </form>
      </div>
    );
  }
  