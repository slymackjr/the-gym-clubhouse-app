import { Mail, User, ChevronDown, Ruler, Scale, X, PhoneCall } from "lucide-react";
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { BsGenderAmbiguous } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddMemberModal({ isOpen, onClose, editMember }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (memberData) =>
      editMember
        ? axiosInstance.put(`/member/${editMember.id}/update`, memberData)
        : axiosInstance.post("/add-member", memberData),
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success(data.data.message, { position: "top-center" });
          queryClient.invalidateQueries('all-members');
        } else {
          toast.error(data.data.message || "An error occurred. Please try again.", {
            position: "top-center",
          });
          if (data.data.errors) setErrors(data.data.errors);
        }
      },
      onError: (error) => {
        const responseErrors = error.data?.errors;
        if (responseErrors) {
          setErrors(responseErrors);
        } else {
          toast.error(error.data?.message || "Unexpected error occurred.", {
            position: "top-center",
          });
        }
      },
    }
  );

  useEffect(() => {
    if (editMember) {
      setName(editMember.name);
      setEmail(editMember.email);
      setRole(editMember.role);
      setPhoneNumber(editMember.phone_number);
      setGender(editMember.gender);
      setHeight(editMember.height);
      setWeight(editMember.weight);
      setMemo(editMember.memo || "");
    } else {
      resetForm();
    }
  }, [editMember]);

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
    setGender("");
    setHeight("");
    setWeight("");
    setMemo("");
    setErrors({});
  };

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const memberData = { name, email, role, phone_number, gender, height, weight, memo };
    mutate(memberData);
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
      <div className="bg-white shadow-lg p-2 max-w-md w-full mx-4 md:mx-0 relative rounded-lg">
          <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center">
        {editMember ? "Edit Member" : "Add Member"}
        </h1>
        <form onSubmit={handleFormSubmit} className="p-2 space-y-2">
          <div className="relative">
            <User className="absolute top-2 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => handleInputChange(e, setName)}
              required
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.name ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          </div>
          <div className="relative">
            <Mail className="absolute top-2 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.email ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>
          <div className="relative">
            <ChevronDown className="absolute top-2 left-3 text-gray-400" />
            <select
              value={role}
              onChange={(e) => handleInputChange(e, setRole)}
              required
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.role ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            >
              <option value="" disabled hidden>Role</option>
              <option value="Member">Member</option>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>}
          </div>
          <div className="relative">
            <BsGenderAmbiguous className="absolute top-2 left-3 text-gray-400" />
            <select
              value={gender}
              onChange={(e) => handleInputChange(e, setGender)}
              required
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.gender ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            >
              <option value="" disabled hidden>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>}
          </div>
          <div className="relative">
            <PhoneCall className="absolute top-2 left-3 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone_number}
              onChange={(e) => handleInputChange(e, setPhoneNumber)}
              required
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.phone_number ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number[0]}</p>}
          </div>
          <div className="relative">
            <Ruler className="absolute left-2 top-2 text-gray-400" />
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => handleInputChange(e, setHeight)}
              required
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.height ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height[0]}</p>}
          </div>
          <div className="relative">
            <Scale className="absolute left-2 top-2 text-gray-400" />
            <input
              type="number"
              value={weight}
              placeholder="Weight (kg)"
              onChange={(e) => handleInputChange(e, setWeight)}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.weight ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height[0]}</p>}
          </div>
          <div className="relative">
            <textarea
              placeholder="Memo (optional)"
              value={memo}
              onChange={(e) => handleInputChange(e, setMemo)}
              className={`pl-4 pr-4 py-2 w-full border rounded-lg focus:outline-none ${errors.memo ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            />
            {errors.memo && <p className="text-red-500 text-sm mt-1">{errors.memo[0]}</p>}
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-orange-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center"
              disabled={isPending}
            >
              {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : editMember ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editMember: PropTypes.object,
};
