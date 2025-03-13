import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from "@tanstack/react-query";

export default function useAuthFetch(apiEndpoint) {
    const { data, isLoading, error } = useQuery([apiEndpoint]);
  
    if (error) {
      toast.error(error.response?.data?.message || 'An error occurred', {
        position: 'top-center',
      });
    }
  
    return { data: data?.data || [], loading: isLoading };
  }
