import { useState } from "react";
import { LoadingComponent, Sidebar } from "../components";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CheckCircle, UploadCloud } from "lucide-react";
import { axiosInstance } from "../hooks";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CompanyProfile() {
  const [logo, setLogo] = useState(null);
  const queryClient = useQueryClient();

  const { data: profile = [], isPending: loading } = useQuery({
    queryKey: ["company"],  
    onError: (error) => {
      toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-center",
      });
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/company", formData);
      return response.data;
    },
      onSuccess: (response) => {
        toast.success(response.data.message, {
          position: "top-center",
        });
        queryClient.invalidateQueries(["companyProfile"]); 
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        toast.error(message, {
          position: "top-center",
        });
      },
    }
  );

    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [tin, setTin] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [founder, setFounder] = useState("");
    const [manager, setManager] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

  if (!loading && profile) {
    if (!companyName) {
      setCompanyName(profile.company_name || "");
      setCompanyEmail(profile.company_email || "");
      setTin(profile.tin || "");
      setDescription(profile.description || "");
      setAddress(profile.address || "");
      setPhone(profile.phone || "");
      setWebsite(profile.website || "");
      setFounder(profile.founder || "");
      setManager(profile.manager || "");
      setAccountName(profile.account_name || "");
      setAccountNumber(profile.account_number || "");
    }
  }
  

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (logo) {
      formData.append("logo", logo);
    }
    formData.append("company_name", companyName);
    formData.append("company_email", companyEmail);
    formData.append("tin", tin);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("website", website);
    formData.append("founder", founder);
    formData.append("manager", manager);
    formData.append("account_name", accountName);
    formData.append("account_number", accountNumber);
    updateProfile(formData);
};

if (loading) {
  return <LoadingComponent />;
}

  return (
    <Sidebar activePage="company" alertPages="company">
      <div className="p-6 bg-white shadow-lg max-w-3xl mx-auto rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Company Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
              <label htmlFor="logoUpload" className="cursor-pointer">
                  <div
                      className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center hover:border-blue-500"
                      title="Click to upload or drag & drop your logo"
                      onDragOver={handleDragOver} 
                      onDrop={handleDrop} 
                  >
                      {logo ? (
                          <img
                              src={URL.createObjectURL(logo)}
                              alt="Company Logo"
                              className="h-28 rounded-full object-cover mx-auto"
                          />
                      ) : profile?.logo ? (
                          <img
                              src={profile.logo}
                              alt="Company Logo"
                              className="h-28 rounded-full object-cover mx-auto"
                          />
                      ) : (
                          <div className="text-gray-500 flex flex-col items-center">
                              <UploadCloud size={48} />
                              <p className="text-sm">Drag & drop your logo here or click to upload</p>
                          </div>
                      )}
                  </div>
              </label>
              <input
                  type="file"
                  id="logoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
              />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Company Email"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="TIN"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tin}
              onChange={(e) => setTin(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Website"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Founder/CEO"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={founder}
              onChange={(e) => setFounder(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Manager"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Account Name"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Account Number"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <textarea
            placeholder="Company Description"
            className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg mt-4 flex items-center justify-center mx-auto"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" size={20} />
            ) : (
              <>
                <CheckCircle size={20} className="mr-2" />
                Update Profile
              </>
            )}
          </button>
        </form>
      </div>
    </Sidebar>
  );
}
