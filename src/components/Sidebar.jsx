import {
  Activity,
  BarChart,
  Building2Icon,
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  Package2,
  Tag,
  User2Icon,
  UserCheck,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { MenuIcon } from "lucide-react";
import PropTypes from 'prop-types';
import { logo3, user } from "../assets";
import { Permission } from "../hooks";
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from "../redux/authSlice";
import { useQueryClient } from '@tanstack/react-query';

const SidebarContext = createContext();

export function SidebarItem({ icon, text, path, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${active ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-800" : "hover:bg-orange-50 text-gray-600"}
      `}
    >
      <Link to={path} className="flex items-center w-full">
        {icon}
        <span className={`overflow-hidden transition-all duration-300 ${expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"}`}>
          {text}
        </span>
      </Link>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${expanded ? "" : "top-2"}`} />
      )}
      {!expanded && (
        <div
          className="absolute left-full ml-6 px-2 py-1 rounded-md bg-orange-100 text-orange-800 text-sm invisible opacity-20 transition-opacity group-hover:visible group-hover:opacity-100"
        >
          {text}
        </div>
      )}
    </li>
  );
}

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  alert: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default function Sidebar({ activePage, alertPages, children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navRef = useRef(null);

  const dispatch = useDispatch();
  const { user: userData } = useSelector((state) => state.auth);
const { email: userEmail, name: userName} = userData;

  

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsNavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (page) => activePage === page;
  const hasAlert = (page) => alertPages.includes(page);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(clearAuth());
    queryClient.clear();
    toast.success('Logged out successfully', { position: 'top-center' });
    navigate('/');
  };

  return (
    <SidebarContext.Provider value={{ expanded: isNavOpen }}>
      <div className="flex h-screen overflow-hidden">
        <aside
          ref={navRef}
          className={`fixed lg:relative lg:z-auto h-screen bg-white border-r shadow-sm transition-all duration-300 ${
            isNavOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-20"
          } lg:translate-x-0`}
        >
          <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
              <img src={logo3} className={`overflow-hidden transition-all duration-300 ${isNavOpen ? "w-32" : "w-0"}`} />
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                {isNavOpen ? <ChevronFirst /> : <ChevronLast />}
              </button>
            </div>
            <ul className="flex-1 px-3">
              <SidebarItem icon={<Activity size={20} />} text="Dashboard" path="/dashboard" active={isActive("dashboard")} alert={hasAlert("dashboard")} />
              <Permission role="admin">
                <SidebarItem icon={<Users size={20} />} text="All Users" path="/all-users" active={isActive("all-users")} alert={hasAlert("all-users")} />
              </Permission>
              <SidebarItem icon={<UserCheck size={20} />} text="All Members" path="/all-members" active={isActive("all-members")} alert={hasAlert("all-members")} />
              <SidebarItem icon={<BarChart size={20} />} text="Invoice Report" path="/invoice-report" active={isActive("invoice-report")} alert={hasAlert("invoice-report")}/>
              <SidebarItem icon={<User2Icon size={20} />} text="Profile" path="/profile" active={isActive("profile")} alert={hasAlert("profile")} />
              <Permission role="admin">
                <SidebarItem icon={<Tag size={20} />} text="All Discounts" path="/all-discounts" active={isActive("all-discounts")} alert={hasAlert("all-discounts")} />
                <SidebarItem icon={<Package2 size={20} />} text="All Packages" path="/all-packages" active={isActive("all-packages")} alert={hasAlert("all-packages")} />
              </Permission>
              <Permission role="admin">
                <SidebarItem icon={<Building2Icon size={20} />} text="Company Profile" path="/company" active={isActive("company")} alert={hasAlert("company")} />
              </Permission>
            </ul>
          </nav>
          <div className="flex p-3 absolute bottom-0 w-full">
            <img src={logo3} className="w-10 h-10 rounded-md" />
            <div className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${isNavOpen ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4">
                <h4 className="font-semibold">{userName}</h4>
                <span className="text-xs text-gray-600">{userEmail}</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="p-4 bg-white shadow-md flex justify-between items-center">
            <button className="lg:hidden" onClick={() => setIsNavOpen(!isNavOpen)}>
              <MenuIcon size={28} />
            </button>
            <div className="ml-auto relative" ref={profileRef} onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img src={user} className="w-10 h-10 rounded-full cursor-pointer" alt="Profile" />
              {isProfileOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-3 border-b">
                  <h4 className="font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{userName}</h4>
                  <span className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{userEmail}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

Sidebar.propTypes = {
  activePage: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  alertPages: PropTypes.string,
};
