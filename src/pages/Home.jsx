import { BarChart, Users, Calendar, UserPlus, FileText, ReplyIcon } from "lucide-react";
import { logo3 } from "../assets";


export default function Home() {
  return (
      <div className="p-6">
        <div className="flex items-center mb-8">
          <img src={logo3} alt="4J's Fitness Centre Logo" className="h-12 w-12 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Welcome to 4Js Fitness Centre ERP</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-blue-50 transition duration-300">
            <Users className="text-blue-600 mr-4" size={32} />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Members</h2>
              <p className="text-gray-500">250</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-green-50 transition duration-300">
            <BarChart className="text-green-600 mr-4" size={32} />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Active Subscriptions</h2>
              <p className="text-gray-500">150</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-yellow-50 transition duration-300">
            <Calendar className="text-yellow-600 mr-4" size={32} />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">New Members This Month</h2>
              <p className="text-gray-500">10</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-purple-50 transition duration-300">
              <UserPlus className="text-purple-600 mr-4" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Add Member</h3>
                <p className="text-gray-500">Register new members quickly</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-orange-50 transition duration-300">
              <FileText className="text-orange-600 mr-4" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Create Invoice</h3>
                <p className="text-gray-500">Generate invoices for members</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center hover:bg-red-50 transition duration-300">
              <ReplyIcon className="text-red-600 mr-4" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Invoice Report</h3>
                <p className="text-gray-500">Access and review all invoices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
