import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function Login() {
  const [SignInUp, setSignInUp] = useState("Sign Up");
  const navigate = useNavigate();

  // LOGIN:
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserProfile(tokenResponse);
    },
    onError: (error) => console.log(error),
  });

  const getUserProfile = async (tokenInfo) => {
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("User Info: ", JSON.stringify(data));
        navigate("/chat");
      })
      .catch((error) => console.error("Error fetching user data: ", error));
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
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col border-2 w-full justify-center gap-4 py-6 px-7 leading-7 rounded-lg"
        >
          <h1 className="text-2xl">{SignInUp}</h1>
          {SignInUp === "Sign Up" ? (
            <input
              type="text"
              placeholder="username"
              className="py-2 px-3 rounded-sm text-gray-800"
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            placeholder="Email address"
            className="py-2 px-3 rounded-sm text-gray-800"
          />
          <input
            type="password"
            placeholder="password"
            className="py-2 px-3 rounded-sm text-gray-800"
          />
          <button
            type="submit"
            className="border-2 bg-sky-500 hover:bg-sky-600 active:translate-y-1 shadow-md duration-200 font-bold text-lg py-2 px-4 inline-block rounded cursor-pointer transition-all"
          >
            {SignInUp === "Sign Up" ? "Create account" : "Login"}
          </button>
          <label htmlFor="login-terms" className="flex justify-center text-sm">
            <input type="checkbox" name="login-terms" />
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

          <div className="flex flex-col items-center">
            <h2 className="mb-3">OR</h2>
            <button
              type="button"
              className="border-2 bg-gray-700 hover:bg-gray-800 active:translate-y-1 shadow-md duration-200 font-bold text-lg py-2 px-7 rounded cursor-pointer transition-all flex items-center gap-2 justify-center"
              onClick={login}
            >
              <FcGoogle />
              {SignInUp === "Sign Up" ? (
                <p>Sign Up with Google</p>
              ) : (
                <>
                  <p>Log In with Google</p>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
