import { Calendar, Clock, FileText, User } from "lucide-react";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { axiosInstance } from "../hooks";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Cards = () => {
  const [totals, setTotals] = useState({
    members: 0,
    invoices: 0,
    packages: 0,
    discounts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await axiosInstance.get("/totals");
        setTotals(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message, { position: 'top-center' });
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  if (loading) return <p>Loading...</p>;


  return (
    <div className="flex-1 p-6 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Members"
        icon={<User  size={40} className="text-green-500" />}
        number="1,234"
        description="Total Members"
        percentage={totals.members}
      />
      <Card
        title="Invoices"
        icon={<FileText size={40} className="text-green-500" />}
        number="567"
        description="Total Invoices"
        percentage={totals.invoices}
      />
      <Card
        title="Today"
        icon={<Calendar size={40} className="text-green-500" />}
        number="48"
        description="Today's Entries"
        percentage={totals.packages}
      />
      <Card
        title="This Month"
        icon={<Clock size={40} className="text-green-500" />}
        number="1,789"
        description="This Month's Entries"
        percentage={totals.discounts}
      />
    </div>
  );
};

const Card = ({ title, icon, number, description, percentage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-start h-48">
      <div className="flex items-center space-x-4 w-full">
        {icon}
        <div className="text-right flex-1">
          <span className="text-3xl font-bold">{number}</span>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-between items-center">
        <span className="text-gray-500">{title}</span>
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute w-full h-full rounded-full border-4 border-green-500">
            <div
              className={`absolute inset-0 rounded-full bg-green-500`}
              style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
            />
          </div>
          <span className="absolute text-lg font-bold text-black">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  number: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired
};

export default Cards;