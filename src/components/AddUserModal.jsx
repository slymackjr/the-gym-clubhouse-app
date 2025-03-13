import { X, Mail, User, ChevronDown, PhoneCall } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react"; 
import { toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddUserModal({ isOpen, onClose, editUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (editUser) {
      setName(editUser.name);
      setEmail(editUser.email);
      setRole(editUser.role);
      setPhoneNumber(editUser.phone_number);
    } else {
      resetForm();
    }
  }, [editUser]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
    setPhoneNumber("");
    setErrors({});
  };

  const { mutate: saveUser, isPending: saving } = useMutation({
    mutationFn: (userData) => {
      const url = editUser ? `/user/${editUser.id}/update` : "/add-user";
      const method = editUser ? "put" : "post";
      return axiosInstance[method](url, userData);
    },
      onSuccess: (response) => {
        if (response.data.success) {
          toast.success(response.data.message, { position: "top-center" });
          queryClient.invalidateQueries("all-users");
        } else if (!response.data.success) {
          toast.error(response.data.message, { position: "top-center" });
          if (response.data.errors) {
            setErrors(response.data.errors);
          } 
        } else {
          toast.error(response.data.message || "Operation failed.", { position: "top-center" });
        }
      },
      onError: (error) => {
        console.log(error);
        const response = error.data;
        if (response?.errors) {
          setErrors(response.errors);
        } else {
          toast.error(response?.message || "An error occurred.", {
            position: "top-center",
          });
        }
      },
    }
  );


  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, role, phone_number };
    saveUser(userData);
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(value);
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      {/* <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable /> */}
      <div className="bg-white shadow-lg p-6 max-w-md w-full mx-4 md:mx-0 relative rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center">
          {editUser ? "Edit User" : "Add User"}
        </h1>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleFormSubmit}>
          <div className="relative">
            <User className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => handleInputChange(e, setName)}
              className={`border p-2 rounded-lg pl-10 w-full focus:outline-none ${errors.name ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          </div>
          <div className="relative">
            <Mail className="absolute left-2 top-2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              className={`border p-2 rounded-lg pl-10 w-full focus:outline-none ${errors.email ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>
          <div className="relative">
            <PhoneCall className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={phone_number}
              onChange={(e) => handleInputChange(e, setPhoneNumber)}
              className={`border p-2 rounded-lg pl-10 w-full focus:outline-none ${errors.phone_number ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
              required
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number[0]}</p>}
          </div>
          <div className="relative">
            <ChevronDown className="absolute left-2 top-2 text-gray-400" />
            <select
              name="role"
              value={role}
              onChange={(e) => handleInputChange(e, setRole)}
              className={`border p-2 rounded-lg pl-10 w-full focus:outline-none ${errors.role ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
              required
            >
              <option value="" disabled>Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>}
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-orange-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center"
              disabled={saving}
            >
              {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : editUser ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editUser: PropTypes.object,
};
