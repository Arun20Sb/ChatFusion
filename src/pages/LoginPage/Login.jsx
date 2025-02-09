import { useState } from "react";
import { SignUp, login } from "../../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [SignInUp, setSignInUp] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Form Submit:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (SignInUp === "Sign Up") {
      SignUp(username, email, password);
    } else {
      login(email, password);
      navigate("/profile");
    }
  };

  return (
    <div className="bg-[#D3D8DE] min-h-screen px-7 md:px-24 h-full exo-font flex justify-evenly items-center max-lg:flex-col gap-5">
      <img
        src="/login_page.jpg"
        alt="ChatFusion"
        width={470}
        height={290}
        className="hidden lg:block"
      />
      <div className="bg-gray-900 text-gray-200 rounded-lg lg:w-[323px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border-2 w-full justify-center gap-4 py-6 px-7 leading-7 rounded-lg"
        >
          <h1 className="text-2xl">{SignInUp}</h1>

          {SignInUp === "Sign Up" && (
            <div>
              <label htmlFor="username" className="text-sm">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                className="py-2 px-3 rounded-sm text-gray-800 w-full"
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              value={email}
              className="py-2 px-3 rounded-sm text-gray-800 w-full"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              className="py-2 px-3 rounded-sm text-gray-800 w-full"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={
                SignInUp === "Sign Up" ? "new-password" : "current-password"
              }
            />
          </div>

          <button
            type="submit"
            className="border-2 bg-sky-500 hover:bg-sky-600 active:translate-y-1 shadow-md duration-200 font-bold text-lg py-2 px-4 inline-block rounded cursor-pointer transition-all"
          >
            {SignInUp === "Sign Up" ? "Create account" : "Login"}
          </button>

          <div className="flex justify-center text-sm">
            <input
              type="checkbox"
              id="login-terms"
              name="login-terms"
              required
            />
            <label htmlFor="login-terms" className="px-2">
              Agree to our Terms of Service and Privacy Policy.
            </label>
          </div>

          <p className="text-sm">
            {SignInUp === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}
            <span
              onClick={() =>
                setSignInUp(SignInUp === "Sign Up" ? "Log In" : "Sign Up")
              }
              className="text-blue-400 px-1 hover:text-blue-500 cursor-pointer"
            >
              {SignInUp === "Sign Up" ? "Log in here." : "Sign up here."}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
