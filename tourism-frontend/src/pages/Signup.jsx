import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { signupUser } from "../services/authService";

function Signup() {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading,setloading]=useState(false)

  const [formData,setFormData]=useState({name:"",email:"",password:"",confirmPassword:""})

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
 const handleSubmit=async(e)=>{
  e.preventDefault();
  if(!formData.name.trim() || !formData.email.trim() || !formData.password){
    toast.warning("Please fill all the fields")
    return;
  }
  if(formData.password!==formData.confirmPassword){
    toast.error("Password do not match")
    return;
  }
setloading(true)
try{
  const data=await signupUser({name:formData.name.trim(),email:formData.email.trim(),password:formData.password})


  toast.success("SignUp successful!");
  navigate("/login")
}catch(err){
toast.error(err.message)
}finally{
  setloading(false)
}

 }  

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-2 sm:px-6 lg:h-screen lg:overflow-hidden">

      
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2
        text-sm font-medium text-gray-600 transition
        hover:bg-[#E8F0E8] hover:text-emerald-800"
      >
        <span className="text-lg">←</span>
        Back to Home
      </Link>

    
      <div
        className="mx-auto mt-2 flex max-w-5xl overflow-hidden
        rounded-3xl border border-gray-100 bg-white shadow-lg
        lg:mt-1 lg:h-[calc(100vh-64px)]"
      >

        
        <div
          className="relative hidden flex-col justify-between
          overflow-hidden bg-gradient-to-br from-emerald-800
          via-emerald-900 to-[#183d32] p-10 text-white
          md:flex md:w-1/2 lg:p-18"
        >
      
          <Link to="/" className="inline-flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center
              rounded-xl bg-[#E8F0E8] text-xl"
            >
              <img className="h-5 w-5" src="./star.png"></img>
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Wander<span className="text-emerald-300">Wise</span>
              </h1>

              <p className="text-[9px] tracking-[1.5px] text-emerald-100">
                TOURISM RECOMMENDATION SYSTEM
              </p>
            </div>
          </Link>

          
          <div className="my-3">
            <p
              className="mb-3 text-xm font-semibold uppercase
              tracking-[3px] text-emerald-300"
            >
              Start exploring
            </p>

            <h2 className="text-3xl font-bold leading-tight lg:text-5xl">
              Every great journey begins somewhere.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-100">
              Create your account, share your travel interests,
              and discover destinations chosen for you.
            </p>
          </div>

          <p className="text-xs text-emerald-200">
            ✦ Your interests. Your journey. Your discoveries.
          </p>
        </div>

        
        <div
          className="flex w-full items-center justify-center
          p-5 sm:p-7 md:w-1/2 lg:p-8"
        >
          <div className="w-full max-w-md">

          
            <Link
              to="/"
              className="mb-4 flex items-center gap-2 md:hidden"
            >
              <div
                className="flex h-9 w-9 items-center justify-center
                rounded-lg bg-[#E8F0E8] text-lg"
              >
                <img className="h-5 w-5" src="./star.png"></img>
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Wander<span className="text-emerald-700">Wise</span>
                </h1>

                <p className="text-[8px] tracking-wider text-gray-500">
                  TOURISM RECOMMENDATION SYSTEM
                </p>
              </div>
            </Link>

            
            <p
              className="text-xs font-semibold uppercase
              tracking-[2.5px] text-emerald-700"
            >
              Join WanderWise
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Start discovering destinations that match your interests.
            </p>

            
            <form onSubmit={handleSubmit} className="mt-5">

            
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  required
                  className="w-full rounded-lg border border-gray-200
                  bg-[#faf9f6] px-3.5 py-2.5 text-sm outline-none
                  transition placeholder:text-gray-400
                  focus:border-emerald-600 focus:ring-2
                  focus:ring-emerald-100"
                />
              </div>

        
              <div className="mt-3">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                   value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-200
                  bg-[#faf9f6] px-3.5 py-2.5 text-sm outline-none
                  transition placeholder:text-gray-400
                  focus:border-emerald-600 focus:ring-2
                  focus:ring-emerald-100"
                />
              </div>

          
              <div className="mt-3">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    
                     value={formData.password}
                  onChange={handleChange}
                    
                    required
                    className="w-full rounded-lg border border-gray-200
                    bg-[#faf9f6] px-3.5 py-2.5 pr-16 text-sm outline-none
                    transition placeholder:text-gray-400
                    focus:border-emerald-600 focus:ring-2
                    focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2
                    -translate-y-1/2 text-xs font-semibold
                    text-emerald-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              
              <div className="mt-3">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    
                     value={formData.confirmPassword}
                  onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200
                    bg-[#faf9f6] px-3.5 py-2.5 pr-16 text-sm outline-none
                    transition placeholder:text-gray-400
                    focus:border-emerald-600 focus:ring-2
                    focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2
                    -translate-y-1/2 text-xs font-semibold
                    text-emerald-700"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

    
              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-emerald-800
                px-4 py-3 text-sm font-semibold text-white
                shadow-md transition hover:bg-emerald-900
                active:scale-[0.99]"
              >
                {loading?"Signing up":"Create Account"}
              </button>
            </form>

    
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700
                hover:text-emerald-900"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;