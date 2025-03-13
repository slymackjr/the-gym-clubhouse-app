import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Sidebar } from "../components";
import { toast } from "react-toastify";
import { axiosInstance } from "../hooks"; 
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { user } from "../assets";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function Profile() {

  const { user: userDatas } = useSelector((state) => state.auth);
  const { id: userId, name: userName, email: userEmail } = userDatas;

   const { mutate: updatePassword, isPending: loading } = useMutation({
      mutationFn: async ({ oldPassword, newPassword }) => {
      const response = await axiosInstance.put(`/password/${userId}/update`, {
        old_password: oldPassword,
        password: newPassword,
      });
      return response.data;
    },
      onSuccess: (response) => {
        toast.success(response.message, { position: "top-center" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
      onError: (error) => {
        const message =
          error.message || "An error occurred. Please try again.";
        toast.error(message, { position: "top-center" });
      },
    }
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (event) => {
    event.preventDefault(); 

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    
    updatePassword({ oldPassword, newPassword });
  };

  return (
    <Sidebar activePage={"profile"} alertPages={"profile"}>
      <div className="p-6 bg-white shadow-lg max-w-lg mx-auto rounded-lg text-center">
        <div className="flex flex-col items-center mb-6">
          <img src={user} alt="User Icon" className="w-24 h-24 rounded-full mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{userName}</h1>
          <p className="text-md text-gray-500">{userEmail}</p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              className="border px-4 py-2 w-full focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="border px-4 py-2 w-full focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="border px-4 py-2 w-full focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg mt-6 flex items-center justify-center mx-auto"
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" size={20} />
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}
