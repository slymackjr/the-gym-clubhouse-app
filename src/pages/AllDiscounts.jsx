import { useState } from "react";
import { Edit, Trash, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { AddDiscountModal, Sidebar, LoadingComponent, Pagination } from "../components";
import { axiosInstance } from "../hooks";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AllDiscounts() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editDiscount, setEditDiscount] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingDiscounts, setLoadingDiscounts] = useState(null);

  const queryClient = useQueryClient();

  const { data: discounts = [], isPending: loading } = useQuery({
    queryKey: ["all-discounts"], 
    onError: (error) => {
      toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-center",
      });
    },
});
  

  const { mutate: toggleDiscount, isPending: toggleLoading } = useMutation({
     mutationFn: (id) => axiosInstance.put(`/discount/${id}/toggle`),
     onMutate: (id) => {
      setLoadingDiscounts(id); 
    },
      onSuccess: (response) => {
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries("all-discounts");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to toggle status.", { position: "top-center" });
        
      },
      onSettled: () => {
        setLoadingDiscounts(null); 
      },
    }
  );

  const { mutate: deleteDiscount, isPending: deleteLoading } = useMutation({
      mutationFn: (id) => axiosInstance.delete(`/discount/${id}/delete`),
      onMutate: (id) => {
        setDeletingId(id); 
      },
      onSuccess: (response) => {
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries("all-discounts");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete discount.", { position: "top-center" });
      },
      onSettled: () => {
        setDeletingId(null); 
      },
    }
  );

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);
    setCurrentPage(0);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setEditDiscount(null); 
  };

  const handleEditDiscount = (discount) => {
    setEditDiscount(discount);
    setModalOpen(true);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const pageCount = Math.ceil(discounts.length / rowsPerPage);
const startIndex = currentPage * rowsPerPage;
const displayedDiscounts = discounts.slice(startIndex, startIndex + rowsPerPage);


  if (loading) return <LoadingComponent />;

  return (
    <Sidebar activePage={"all-discounts"} alertPages={"all-discounts"}>
      <div className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Discounts</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
            placeholder="Search by discount name, package..."
            value={search || ""}
            onChange={handleSearch}
          />
          <div className="flex gap-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={15}>15 rows</option>
              <option value={20}>20 rows</option>
              <option value={25}>25 rows</option>
              <option value={30}>30 rows</option>
            </select>
            <button
              onClick={openModal}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus size={20} className="mr-2" />Discount
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3">Discount Name</th>
                <th className="border p-3">Percentage (%)</th>
                <th className="border p-3">Enabled</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedDiscounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{discount.name}</td>
                  <td className="border p-3">{discount.percentage}%</td>
                  <td className="border p-3">
                    <button
                      onClick={() => toggleDiscount(discount.id)}
                      className="flex items-center justify-center"
                      disabled={loadingDiscounts === discount.id && toggleLoading} 
                    >
                      {loadingDiscounts === discount.id && toggleLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-gray-500" size={18} />
                      ) : discount.active ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                    </button>
                  </td>
                  <td className="border p-3 flex space-x-4 justify-center">
                    <button onClick={() => handleEditDiscount(discount)} className="text-green-600 hover:underline">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === discount.id && deleteLoading}
                    >
                      {deletingId === discount.id && deleteLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-gray-500" size={18} />
                      ) : (
                        <Trash size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        <AddDiscountModal  
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
          }}
          discount={editDiscount}
        />
      </div>
    </Sidebar>
  );
}
