import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddDiscountModal({ isOpen, onClose, discount }) {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (discount) {
      setName(discount.name);
      setPercentage(discount.percentage);
      setActive(discount.active);
    } else {
      resetForm();
    }
  }, [discount]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setPercentage(0);
    setActive(false);
    setErrors({});
  };

  const { mutate: saveDiscount, isPending: saving } = useMutation({
    mutationFn: (discountData) => {
      const url = discount ? `/discount/${discount.id}/update` : "/discount";
      const method = discount ? "put" : "post";
      return axiosInstance[method](url, discountData);
    },
      onSuccess: (response) => {
        if(response.data.success){
          toast.success(response.data.message, { position: "top-center" });
          queryClient.invalidateQueries("all-discounts");
        } else if (!response.data.success){
          toast.error(response.data.message, { position: "top-center" });
          if (response.data.errors) {
            setErrors(response.data.errors);
          }
        } else {
          toast.error("An error occurred", { position: "top-center" });
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
    }
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const discountData = { name, percentage, active };
    saveDiscount(discountData);
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
          {discount ? "Edit Discount" : "Create New Discount"}
        </h1>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Discount Name"
            value={name}
            onChange={(e) => handleInputChange(e, setName)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.name ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          <input
            type="number"
            name="percentage"
            placeholder="Discount Percentage (%)"
            value={percentage}
            onChange={(e) => handleInputChange(e, setPercentage)}
            className={`border p-2 rounded-lg w-full focus:outline-none ${errors.percentage ? 'border-red-500 ring-red-500' : 'focus:ring-2 focus:ring-green-500'}`}
            required
          />
          {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage[0]}</p>}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mr-2"
            />
            <span>Enabled</span>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              disabled={saving}
            >
              {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : discount ? "Update Discount" : "Save Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddDiscountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  discount: PropTypes.object,
};
