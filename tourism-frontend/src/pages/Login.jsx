import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setloading]=useState(false)
 
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(!email.trim() || !password){
      toast.warning("Please enter all the fields")
      return
    }
    try{
      setloading(true)
      const data=await loginUser({
        email:email.trim(),
        password
      })
      localStorage.setItem("token",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      navigate("/destination",)
    }  
  catch(err){
    toast.error(err.message)
  }finally{
    setloading(false)
  }
}


  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-4 sm:px-8">

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2
        text-sm font-medium text-gray-600 transition hover:bg-[#E8F0E8]
        hover:text-emerald-800"
      >
        <span className="text-lg">←</span>
        Back to Home
      </Link>

      <div className="mx-auto mt-5 flex min-h-[600px] max-w-5xl
      overflow-hidden rounded-3xl border border-gray-100 bg-white
      shadow-xl md:mt-8">

               <div className="relative hidden flex-col justify-between
        overflow-hidden bg-emerald-900 p-10 text-white
        md:flex md:w-1/2 lg:p-14">

          <div className="absolute inset-0 bg-gradient-to-br
          from-emerald-800 via-emerald-900 to-[#183d32]" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center
              rounded-xl bg-[#E8F0E8] text-2xl">
                <img className="h-5 w-5" src="./star.png"></img>
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Wander<span className="text-emerald-300">Wise</span>
                </h1>

                <p className="text-[10px] tracking-[2px] text-emerald-100">
                  TOURISM RECOMMENDATION SYSTEM
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 my-12">
            <p className="mb-4 text-sm font-semibold uppercase
            tracking-[3px] text-emerald-300">
              Welcome back
            </p>

            <h2 className="text-4xl font-bold leading-tight lg:text-5xl">
              Your next adventure is waiting.
            </h2>

            <p className="mt-6 max-w-sm leading-7 text-emerald-100">
              Discover destinations that match your interests and
              find places you'll love with personalized recommendations.
            </p>
          </div>

          <p className="relative z-10 text-sm text-emerald-200">
            ✦ Discover more. Travel better.
          </p>
        </div>

  
        <div className="flex w-full items-center justify-center p-6
        sm:p-10 md:w-1/2 lg:p-14">

          <div className="w-full max-w-md">


            <Link to="/" className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center
              rounded-xl bg-[#E8F0E8] text-xl">
                <img className="h-5 w-5" src="./star.png"></img>
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Wander<span className="text-emerald-700">Wise</span>
                </h1>

                <p className="text-[9px] tracking-widest text-gray-500">
                  TOURISM RECOMMENDATION SYSTEM
                </p>
              </div>
            </Link>

            <p className="text-sm font-semibold uppercase tracking-[3px]
            text-emerald-700">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Login to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Continue your journey and discover your next destination.
            </p>

            <form onSubmit={handleSubmit}>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e)=>{setemail(e.target.value)}}
                  required
                  className="w-full rounded-xl border border-gray-200
                  bg-[#faf9f6] px-4 py-3 outline-none transition
                  placeholder:text-gray-400 focus:border-emerald-600
                  focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                  onChange={(e)=>{setpassword(e.target.value)}}
                    required
                    className="w-full rounded-xl border border-gray-200
                    bg-[#faf9f6] px-4 py-3 pr-20 outline-none transition
                    placeholder:text-gray-400 focus:border-emerald-600
                    focus:ring-2 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                    text-sm font-medium text-emerald-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 w-full rounded-xl bg-emerald-800 px-4 py-3.5
                font-semibold text-white shadow-md transition
                hover:bg-emerald-900 active:scale-[0.99]"
              >
                {loading?"Logging in...":"Login"}
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Sign up
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}



export default Login;