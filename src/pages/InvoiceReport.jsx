import { Download, FilePlus, Trash2 } from "lucide-react";
import { CreateInvoiceForm, Sidebar, LoadingComponent, Pagination } from "../components";
import { useState } from "react";
import { axiosInstance, Permission} from "../hooks";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CircleLoader } from 'react-spinners';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function InvoiceReport() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null); 
  const [deletingId, setDeletingId] = useState(null);

  const queryClient = useQueryClient();

  const { data: invoices = [], isPending: loading } = useQuery({
    queryKey: ["invoice-reports"],
    onError: (error) => {
      toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-center",
      });
    }, 
  });

  const { mutate: deleteInvoice, isPending: deleteLoading } = useMutation({
      mutationFn: (id) => axiosInstance.delete(`/invoices/${id}`),
      onMutate: (id) => {
        setDeletingId(id); 
      },
      onSuccess: (response) => {
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries("invoice-reports");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "An error occurred.", { position: "top-center" });
      },
      onSettled: () => {
        setDeletingId(null); 
      },
    }
  );

   const viewReport = async (id) => {
    setLoadingInvoiceId(id);
    try {
      const response = await axiosInstance.get(`/invoice-report/${id}/report`);
      if (response.data.success) {
        const pdfUrl = response.data.data.download_url;
        window.open(pdfUrl, "_blank");
      } else {
        toast.error(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.", { position: "top-center" });
    } finally {
      setLoadingInvoiceId(null);
    }
  };

   // Search functionality
   const filteredInvoices = invoices.filter((invoice) =>
    [invoice.member_phone, invoice.member_name, invoice.package_name]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(search.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredInvoices.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const displayedInvoices = filteredInvoices.slice(startIndex, startIndex + rowsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0); 
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Sidebar activePage={"invoice-report"} alertPages={"invoice-report"}>
      <div className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Invoice Report</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
            placeholder="Search by name, phone, package..."
            value={search}
            onChange={handleSearch}
          />
          <div className="flex gap-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={15}>15 rows</option>
              <option value={20}>20 rows</option>
              <option value={25}>25 rows</option>
              <option value={30}>30 rows</option>
            </select>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={openModal}
            >
              <FilePlus size={20} className="mr-2" /> Invoice
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3">Invoice ID</th>
                <th className="border p-3">MemberID</th>
                <th className="border p-3">Member</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Memo</th>
                <th className="border p-3">Package</th>
                <th className="border p-3">StartDate</th>
                <th className="border p-3">EndDate</th>
                <th className="border p-3">Download</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{invoice.id}</td>
                  <td className="border p-3">{invoice.member_id}</td>
                  <td className="border p-3">{invoice.member_name}</td>
                  <td className="border p-3">{invoice.member_phone}</td>
                  <td className="border p-3">{invoice.amount_paid}</td>
                  <td className="border p-3">{invoice.status}</td>
                  <td className="border p-3">{invoice.memo}</td>
                  <td className="border p-3">{invoice.package_name}</td>
                  <td className="border p-3">{invoice.start_date}</td>
                  <td className="border p-3">{invoice.end_date}</td>
                  <td className="border p-3 flex gap-7">
                    <button
                      onClick={() => viewReport(invoice.id)}
                      className="text-green-600 hover:text-green-800"
                      disabled={loadingInvoiceId === invoice.id} 
                    >
                      {loadingInvoiceId === invoice.id ? (
                        <CircleLoader size={20} color="#4CAF50" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                    <Permission role="admin">
                      <button
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deletingId === invoice.id && deleteLoading}
                      >
                        {deletingId === invoice.id && deleteLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-gray-500" size={18} />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      </button>
                    </Permission>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        <CreateInvoiceForm 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </Sidebar>
  );
}
