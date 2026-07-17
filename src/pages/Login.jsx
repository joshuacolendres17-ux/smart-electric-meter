import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-panel rounded-lg border border-white/5 p-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={20} className="text-copper" />
          <p className="text-copper font-display font-bold text-sm tracking-wide">
            SEM CONTROL
          </p>
        </div>
        <h1 className="text-xl font-display font-bold text-white mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-copper"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest text-white/40 uppercase mb-2 block">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel-light border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-copper"
            />
          </div>

          {error && (
            <p className="text-safety-red text-xs bg-safety-red/10 border border-safety-red/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-copper hover:bg-copper/90 text-black text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <button
          onClick={() => { setIsSignup(!isSignup); setError(""); }}
          className="w-full text-center text-xs text-white/40 hover:text-white/70 mt-5"
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default Login;