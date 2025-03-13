import { Edit, Trash, UserPlus } from "lucide-react";
import { AddMemberModal, Sidebar, LoadingComponent, Pagination, DownloadExcel } from "../components";
import { useState} from "react";
import { Permission} from "../hooks";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export default function AllMembers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false); 
  const [editMember, setEditMember] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: members = [], isPending: loading } = useQuery({
    queryKey: ["all-members"],
    onError: (error) => {
      toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-center",
      });
    }, 
  });

  const { mutate: deleteMember, isPending: deleteLoading } = useMutation({
      mutationFn: (id) => axiosInstance.delete(`/member/${id}/delete`),
      onMutate: (id) => {
        setDeletingId(id); 
      },
      onSuccess: (response) => {
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries("all-members");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete member.", {
          position: "top-center",
        });
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
    setEditMember(null);
  };

  const handleEditMember = (member) => {
    setEditMember(member);
    setModalOpen(true);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

const filteredMembers = members.filter((member) =>
    [member.name, member.role, member.startDate, member.endDate]
      .join(" ")
      .toLowerCase()
      .includes(search)
  );

  const pageCount = Math.ceil(filteredMembers.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const displayedMembers = filteredMembers.slice(startIndex, startIndex + rowsPerPage);

  if (loading) return <LoadingComponent />;

  return (
    <Sidebar activePage={"all-members"} alertPages={"all-member"}>
      <div className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Members</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
            placeholder="Search by name, role, date..."
            value={search}
            onChange={handleSearch}
          />
          <div className="flex space-x-4">
          <select
            className="border px-4 py-2 rounded-lg"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[5, 10, 15, 20, 25, 30].map((rows) => (
                <option key={rows} value={rows}>
                  {rows} rows
                </option>
              ))}
          </select>
          <button
              onClick={openModal}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus size={20} className="mr-2" />Member
            </button>
          </div>
          <Permission role="admin">
            <DownloadExcel/>
            </Permission>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3">Name</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone Number</th>
              <th className="border p-3">Gender</th>
              <th className="border p-3">Height</th>
              <th className="border p-3">weight</th>
              <th className="border p-3">Memo</th>
              <Permission role="admin">
              <th className="border p-3">Actions</th>
              </Permission>
            </tr>
          </thead>
          <tbody>
            {displayedMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100 transition-colors">
                <td className="border p-3">{member.name}</td>
                <td className="border p-3">{member.role}</td>
                <td className="border p-3">{member.email}</td>
                <td className="border p-3">{member.phone_number}</td>
                <td className="border p-3">{member.gender}</td>
                <td className="border p-3">{member.height}</td>
                <td className="border p-3">{member.weight}</td>
                <td className="border p-3">{member.memo}</td>
                  <Permission role="admin">
                  <td className="border p-3 flex space-x-4 justify-center">
                      <button
                          onClick={() => handleEditMember(member)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Member"
                        >
                          <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Member"
                        disabled={deletingId === member.id && deleteLoading}
                      >
                       {deletingId === member.id && deleteLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-gray-500" size={18} />
                      ) : (
                        <Trash size={18} />
                      )}
                      </button>
                    </td>
                  </Permission>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        <AddMemberModal
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
          }}
          editMember={editMember}
        />
      </div>
    </Sidebar>
  );
}
