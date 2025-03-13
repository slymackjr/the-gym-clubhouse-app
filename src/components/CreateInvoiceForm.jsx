import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";


export default function CreateInvoiceForm({ isOpen, onClose}) {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [totalPriceTZS, setTotalPriceTZS] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [memo, setMemo] = useState("");

  const queryClient = useQueryClient();

   const { user: userData } = useSelector((state) => state.auth);
   const { email: userEmail, name: userName, phone_number: userPhone } = userData;

  useEffect(() => {
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    };
    setStartDate(getCurrentDate());
  }, []);

    const { data: members = []} = useQuery({
      queryKey: ["all-members"],  
      onError: (error) => {
        toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
          position: "top-center",
        });
      }, 
    });
    const { data: packages = []} = useQuery({
      queryKey: ["all-packages"],
      onError: (error) => {
        toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
          position: "top-center",
        });
      }, 
    });
    const { data: discounts = []} = useQuery({
      queryKey: ["active-discounts"], 
      onError: (error) => {
        toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
          position: "top-center",
        });
      },
    });

  const createInvoiceMutation = useMutation({
    mutationFn: (invoiceData) => axiosInstance.post("/create-invoice", invoiceData),
      onSuccess: (response) => {
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries(["all-members", "all-packages", "active-discounts","invoice-reports"]);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "An error occurred. Please try again.",
          { position: "top-center" }
        );
      },
    }
  );
  if (!isOpen) return null;

  const filteredMembers = members?.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePackageChange = (event) => {
    const selectedPackage = packages.find((pkg) => pkg.name === event.target.value);
    setSelectedPackage(selectedPackage);
    setTotalPriceTZS(selectedPackage?.priceTZS || 0);
    calculateEndDate(selectedPackage?.duration);
  };

  const handleDiscountChange = (event) => {
    const discount = discounts.find((d) => d.name === event.target.value);
    setSelectedDiscount(discount);

    if (selectedPackage && discount) {
      const discountFactor = 1 - discount.percentage / 100;
      const discountedPrice = selectedPackage.priceTZS * discountFactor;
      setTotalPriceTZS(discountedPrice.toFixed(2));
    } else if (selectedPackage) {
      setTotalPriceTZS(selectedPackage.priceTZS);
    }
  };

  const calculateEndDate = (duration) => {
    if (!startDate || !duration) return;
    const start = new Date(startDate);
    start.setDate(start.getDate() + duration);
    setEndDate(start.toISOString().split("T")[0]);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    calculateEndDate(selectedPackage?.duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMember || !selectedPackage) {
      toast.error("Please select a member and package.", { position: 'top-center' });
      return;
    }

    const invoiceData = {
      user_name: userName,
      user_phone: userPhone,
      user_email: userEmail,
      member_id: selectedMember.id,
      member_name: selectedMember.name,
      member_phone: selectedMember.phone_number,
      package_name: selectedPackage.name,
      discount_percentage: selectedDiscount?.percentage || 0,
      start_date: startDate,
      end_date: endDate,
      amount_paid: totalPriceTZS,
      status: paymentStatus,
      memo: memo || '',
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white shadow-lg p-3 w-full max-w-md relative rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="grid gap-2">
          <div>
            <input
              type="text"
              placeholder="Search Member by Name"
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="bg-white border rounded-lg max-h-20 overflow-auto mt-2">
              {filteredMembers?.map((member) => (
                <li
                  key={member.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  {member.name}
                </li>
              ))}
            </ul>
            {selectedMember && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Select Member Name"
                  className="border p-2 rounded-lg w-full bg-gray-200"
                  value={selectedMember?.name || ""}
                  disabled
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handlePackageChange}
              value={selectedPackage?.name || ""}
              required
            >
              <option value="" disabled>Select Package</option>
              {packages?.map((pkg) => (
                <option key={pkg.id} value={pkg.name}>
                  {pkg.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={startDate || ""}
              onChange={handleStartDateChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className="border p-2 rounded-lg focus:outline-none bg-gray-200 w-full"
              placeholder="End Date"
              value={endDate || ""}
              readOnly
            />

            <select
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleDiscountChange}
              value={selectedDiscount?.name || ""}
            >
              <option value="" disabled>No Discount</option>
              {discounts?.map((discount) => (
                <option key={discount.id} value={discount.name}>
                  {discount.name} ({discount.percentage}% Off)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 rounded-lg">
              <input
                type="text"
                id="totalPriceTZS"
                className="border p-2 rounded-lg focus:outline-none bg-gray-200 w-full"
                placeholder="Total Price"
                value={totalPriceTZS || ""}
                readOnly
              />
            </div>

            <select
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPaymentStatus(e.target.value)}
              value={paymentStatus || ""}
              required
            >
              <option value="" disabled>Select Payment Status</option>
              <option value="cash">Cash</option>
              <option value="mobile">Mobile</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div>
          <textarea
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter memo (optional)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-orange-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center"
              disabled={createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateInvoiceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
