import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddPackageModal({ isOpen, onClose, packageData }) {
  const [name, setName] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [priceTZS, setPriceTZS] = useState("");
  const [duration, setDuration] = useState(0);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (packageData) {
      setName(packageData.name);
      setPriceUSD(packageData.priceUSD);
      setPriceTZS(packageData.priceTZS);
      setDuration(packageData.duration);
    } else {
      resetForm();
    }
  }, [packageData]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setPriceUSD("");
    setPriceTZS("");
    setDuration(0);
    setErrors({});
  };

  const { mutate: savePackage, isPending: saving } = useMutation({
    mutationFn: (packageDetails) => {
      const url = packageData ? `/package/${packageData.id}/update` : "/package";
      const method = packageData ? "put" : "post";
      return axiosInstance[method](url, packageDetails);
    },
    onSuccess: (response) => {
      if(response.data.success){
        toast.success(response.data.message, { position: "top-center" });
      queryClient.invalidateQueries("all-packages");
      } else if (!response.data.success){
        toast.error(response.data.message, { position: "top-center" });
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      } else {
        toast.error("An error occurred while saving package", { position: "top-center" });
      }
      
    },
    onError: (error) => {
      const response = error.response?.data;
      if (response?.errors) {
        setErrors(response.errors);
      } else {
        toast.error(response?.message || "An error occurred.", { position: "top-center" });
      }
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const packageDetails = { name, priceUSD, priceTZS, duration };
    savePackage(packageDetails);
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(value);

    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white shadow-lg p-6 max-w-md w-full mx-4 md:mx-0 relative rounded-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <X size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center">
          {packageData ? "Edit Package" : "Create New Package"}
        </h1>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Package Name"
            value={name}
            onChange={(e) => handleInputChange(e, setName)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.name ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}

          <input
            type="number"
            name="priceUSD"
            placeholder="Price in USD"
            value={priceUSD}
            onChange={(e) => handleInputChange(e, setPriceUSD)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.priceUSD ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.priceUSD && <p className="text-red-500 text-sm mt-1">{errors.priceUSD[0]}</p>}

          <input
            type="number"
            name="priceTZS"
            placeholder="Price in TZS"
            value={priceTZS}
            onChange={(e) => handleInputChange(e, setPriceTZS)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.priceTZS ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.priceTZS && <p className="text-red-500 text-sm mt-1">{errors.priceTZS[0]}</p>}

          <input
            type="number"
            name="duration"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => handleInputChange(e, setDuration)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.duration ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration[0]}</p>}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              disabled={saving}
            >
              {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : packageData ? "Update Package" : "Save Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddPackageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageData: PropTypes.object,
};
