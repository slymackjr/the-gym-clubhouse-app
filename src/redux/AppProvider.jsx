import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { axiosInstance } from '../hooks';
import PropTypes from 'prop-types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await axiosInstance.get(queryKey[0]); 
        return response.data.data;
      },
      staleTime: 300000, 
      cacheTime: 900000, 
      refetchInterval: 10000, 
      refetchOnMount: false, 
      refetchOnWindowFocus: false,  
      retry: 1,
    },
  },
});

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export function AppProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
