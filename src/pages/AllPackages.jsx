import { useState } from "react";
import { Edit, Trash, PackagePlus } from "lucide-react";
import { Sidebar, LoadingComponent, Pagination } from "../components";
import { axiosInstance } from "../hooks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddPackageModal from "../components/AddPackageModal";

export default function AllPackages() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const queryClient = useQueryClient();

  const { data: packages = [], isPending: loading } = useQuery({
    queryKey: ["all-packages"],
    onError: (error) => {
      toast.error(
        "An error occurred: " + (error.response?.data?.message || "Unknown error"),
        { position: "top-center" }
      );
    },
  });

  const { mutate: deletePackage, isPending: deleteLoading } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/package/${id}/delete`),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: (response) => {
      toast.success(response.data.message, { position: "top-center" });
      queryClient.invalidateQueries("all-packages");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete package.", { position: "top-center" });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);
    setCurrentPage(0);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setEditPackage(null);
  };

  const handleEditPackage = (pkg) => {
    setEditPackage(pkg);
    setModalOpen(true);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const filteredPackages = packages.filter((pkg) =>
    [pkg.name]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(search.toLowerCase()))
  );
  const pageCount = Math.ceil(filteredPackages.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const displayedPackages = filteredPackages.slice(startIndex, startIndex + rowsPerPage);
 
  if (loading) return <LoadingComponent />;

  return (
    <Sidebar activePage={"all-packages"} alertPages={"all-packages"}>
      <div className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Packages</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
            placeholder="Search by package name..."
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
              <PackagePlus size={20} className="mr-2" />
              Add Package
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3">Package Name</th>
                <th className="border p-3">Price (USD)</th>
                <th className="border p-3">Price (TZS)</th>
                <th className="border p-3">Duration (Days)</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{pkg.name}</td>
                  <td className="border p-3">${pkg.priceUSD}</td>
                  <td className="border p-3">{pkg.priceTZS} TZS</td>
                  <td className="border p-3">{pkg.duration}</td>
                  <td className="border p-3 flex space-x-4 justify-center">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="text-green-600 hover:underline"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === pkg.id && deleteLoading}
                    >
                      {deletingId === pkg.id && deleteLoading ? (
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
        <AddPackageModal  
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
          }}
          packageData={editPackage}
        />
      </div>
    </Sidebar>
  );
}
