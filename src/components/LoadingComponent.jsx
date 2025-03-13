import { Loader } from "lucide-react"; 

export default function LoadingComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Loader className="text-indigo-500 text-6xl animate-spin" />
        </div>
    );
}


