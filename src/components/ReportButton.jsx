import { Download } from "lucide-react";

export default function ReportButton(){
    return (
        <div className="flex justify-end">
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          onClick={() => {
            
           }}
        >
          <Download className="mr-2" />
          Report
        </button>
        </div>
    )
}