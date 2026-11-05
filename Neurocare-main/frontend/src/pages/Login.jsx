import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { login } from "../lib/api.js";
import NeuroCareLogo from "../components/NeuroCareLogo.jsx";

const Login = () => {
  const { googlelogin, fetchUser, setUserFromResponse } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("student"); // default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // helper: extract an id safely
  const extractId = (user) => {
    if (!user) return null;
    return user._id || user.id || user.userId || user._uid || null;
  };

  // helper: redirect user to either verify page or dashboard
  const routeAfterLogin = (user) => {
    if (!user) return navigate("/");

    const id = extractId(user);
    const userRole = user.role?.toLowerCase();
    const normalizedRole = userRole === "counselor" ? "counsellor" : userRole;
    // If student and not verified -> send to verification flow first
    if (normalizedRole === "student" && !user.isVerified) {
      // student verify page; your StudentForm should use auth context (currentUser) for details
      return navigate("/student/verify");
    }

    // otherwise direct to dashboard url /student/:id or /counsellor/:id
    if (id) {
      return navigate(`/${normalizedRole}/${id}`);
    }

    // fallback
    return navigate("/");
  };

  // --- Handle Google OAuth redirect ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauth = params.get("oauth"); // expected: ?oauth=google

    if (oauth === "google") {
      (async () => {
        setLoading(true);
        try {
          const user = await fetchUser();
          if (user) {
            setUserFromResponse(user);
            routeAfterLogin(user);
            return;
          }
          setError("Could not fetch user after Google login.");
        } catch (err) {
          console.error("OAuth login/fetchUser failed:", err);
          setError("Google login failed. Please try again.");
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // --- Handle email/password login ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password, role });
      // prefer res.user, otherwise fallback to fetchUser()
      let user = res?.user || null;
      if (!user) user = await fetchUser();

      if (!user) {
        setError("Login succeeded but user details could not be fetched.");
        setLoading(false);
        return;
      }

      // update global auth context
      setUserFromResponse(user);

      // route to verify page or dashboard
      routeAfterLogin(user);
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 dark:text-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6 text-center">
          <NeuroCareLogo className="justify-center" wordmarkClassName="text-2xl text-white dark:text-white" />
          <p className="text-blue-100 mt-2">
            Your mental wellness journey starts here
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-slate-100">
            Login to NeuroCare
          </h2>

          {/* Role selector */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              disabled={loading}
              className={`px-4 py-2 rounded-xl border font-medium ${
                role === "student"
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("counsellor")}
              disabled={loading}
              className={`px-4 py-2 rounded-xl border font-medium ${
                role === "counsellor"
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              Counsellor
            </button>
          </div>

          {/* Email/password form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a valid email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 dark:bg-slate-800 dark:text-slate-300">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => !loading && googlelogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <img src="/google-logo.svg" alt="Google logo" className="w-5 h-5" />
            Sign in with Google
          </button>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-gray-600 dark:text-slate-300">Don't have an account? </span>
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
