import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react"; // Importing icons from Lucide React
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { logo3 } from "../assets";
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from "../redux/authSlice";


export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
const [errors, setErrors] = useState({});

const { token, role } = useSelector((state) => state.auth);

useEffect(() => {

  if (token && role) {
    navigate('/dashboard');
  }
}, [navigate,token,role]);

const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async () => {
    const response = await axiosInstance.post('/login', formData);
    return response.data;
  },
  onSuccess: (data) => {
    if (data.success === true) {
      const { token, ability, user } = data;
      const role = ability;
  
      dispatch(setAuth({ token, role, user }));
  
      toast.success(data.message || "Login successful.", { position: "top-center" });
      navigate("/dashboard");
    } else if (data.success === false) {
      toast.error(data.message || "An error occurred. Please try again.", {
        position: "top-center",
      });
    } else {
      toast.warning("Unexpected response received.", {
        position: "top-center",
      });
    }
  },
  
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message, { position: 'top-center' });
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  }
);

const handleLogin = async (e) => {
  e.preventDefault();
  login();
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center">
          <Link to={'/'}>
          <img src={logo3} alt="Logo" className="w-40" />
          </Link>
        </div>
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form className="grid grid-cols-1 gap-7" onSubmit={handleLogin} >
            <div className="relative">
              <Mail className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`border p-3 rounded-lg pl-10 w-full focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-500' : 'focus:ring-orange-600'}`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 absolute left-0 right-0">{errors.email[0]}</p>}
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`border p-3 rounded-lg pl-10 w-full focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 ring-red-500' : 'focus:ring-orange-600'}`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 absolute left-0 right-0">{errors.password[0]}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <>
                  <LogIn className="mr-2" /> 
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
  );
}
