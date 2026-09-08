import { useEffect, useState } from "react";
import {
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    admin,
    login,
  } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [admin, navigate]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      toast.success(
        "Welcome back."
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-shell">

        {/* Brand */}
        <div className="admin-auth-brand">

          <span className="section-kicker">
            Alankruti Crafts
          </span>

          <h1>
            Admin
            <br />
            Workspace
          </h1>

          <p>
            Manage products, orders and
            customers from one secure
            workspace.
          </p>

        </div>

        {/* Login Card */}
        <div className="admin-auth-card">

          <div className="admin-auth-icon">
            <LockKeyhole size={24} />
          </div>

          <div className="admin-auth-heading">

            <span className="section-kicker">
              Secure access
            </span>

            <h2>
              Admin sign in
            </h2>

            <p>
              Enter your administrator
              credentials to continue.
            </p>

          </div>

          <form
            className="admin-auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <div className="form-group">

              <label htmlFor="admin-email">
                Email address
              </label>

              <div className="admin-input-wrapper">

                <Mail size={17} />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Password */}
            <div className="form-group">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-input-wrapper">

                <LockKeyhole size={17} />

                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-large admin-login-button"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="admin-auth-footer">

            <Link to="/">
              ← Return to storefront
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;