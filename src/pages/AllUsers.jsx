import { LoadingComponent, Sidebar, AddUserModal, Pagination } from "../components";
import { useState} from "react";
import { Edit, Trash, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from "../hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AllUsers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const queryClient = useQueryClient();

  const { data: users = [], isPending: loading } = useQuery({
    queryKey: ["all-users"],  
  });

  const { mutate: deleteUser, isPending: deleteLoading } = useMutation({
      mutationFn: (id) => axiosInstance.delete(`/user/${id}/delete`),
      onMutate: (id) => {
        setDeletingUserId(id); 
      },
      onSuccess: (response) => {
        toast.dismiss();
        toast.success(response.data.message, { position: "top-center" });
        queryClient.invalidateQueries("all-users");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete user.", { position: "top-center" });
      },
      onSettled: () => {
        setDeletingUserId(null); 
      },
    }
  );

  const filteredUsers = users.filter((user) =>
    [user.name, user.role, user.email]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(search.toLowerCase()))
  );
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null); 
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Sidebar activePage={"all-users"} alertPages={"all-users"}>
      <div className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
            placeholder="Search by name, role, email..."
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
          </select>
          <button
            onClick={openModal}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <UserPlus size={20} className="mr-2" />User
          </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3">Name</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Phone Number</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{user.name}</td>
                  <td className="border p-3">{user.role}</td>
                  <td className="border p-3">{user.email}</td>
                  <td className="border p-3">{user.phone_number}</td>
                  <td className="border p-3 flex space-x-4 justify-center">
                  <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                        disabled={deletingUserId === user.id && deleteLoading}
                      >
                       {deletingUserId === user.id && deleteLoading ? (
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

        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
          }}
          editUser={editUser}
        />
      </div>
    </Sidebar>
  );
}
