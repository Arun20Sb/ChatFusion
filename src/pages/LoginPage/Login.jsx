import { useState } from "react";
import { SignUp, login } from "../../config/FirebaseConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [SignInUp, setSignInUp] = useState("Sign Up");

  // Form Submit:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (SignInUp === "Sign Up") {
      SignUp(username, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="bg-[#D3D8DE] min-h-screen px-7 md:px-24 h-full exo-font flex justify-evenly  items-center max-lg:flex-col gap-5">
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
          {SignInUp === "Sign Up" ? (
            <input
              type="text"
              placeholder="username"
              value={username}
              className="py-2 px-3 rounded-sm text-gray-800"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            className="py-2 px-3 rounded-sm text-gray-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            className="py-2 px-3 rounded-sm text-gray-800"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="border-2 bg-sky-500 hover:bg-sky-600 active:translate-y-1 shadow-md duration-200 font-bold text-lg py-2 px-4 inline-block rounded cursor-pointer transition-all"
          >
            {SignInUp === "Sign Up" ? "Create account" : "Login"}
          </button>
          <label htmlFor="login-terms" className="flex justify-center text-sm">
            <input type="checkbox" name="login-terms" required />
            <span className="px-2">
              Agree to our Terms of Service and Privacy Policy.
            </span>
          </label>
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
