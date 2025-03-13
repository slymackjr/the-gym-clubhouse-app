import { Download } from "lucide-react";
import { axiosInstance } from "../hooks";

export default function DownloadExcel ()  {
    const handleDownload = async () => {
      try {
        const response = await axiosInstance.get("/export-members-invoices", {
          responseType: "blob", 
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "members_invoices.xlsx"); 
  
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading the file", error);
        alert("Failed to download the file. Please try again.");
      }
    };
  
    return (
      <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg  flex items-center justify-center">
        <Download className="mr-2"/>
        Excel Sheet
      </button>
    );
  }