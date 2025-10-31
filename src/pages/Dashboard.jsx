import { useNavigate } from "react-router-dom"
import { logout } from "../utils/auth";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import TutorList from "@/components/tutor/TutorList";
import { useUser } from "@/contexts/UserContextProvider";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useUser();

    if(user?.role === "tentor") {
      navigate("/profile");
    }

    return (
        <>
          <Header />
          <SearchBar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {user?.role === "mentee" ? 
            <>
              <TutorList />
            </> : 
            <>
            Bro  
            </>}
          </div>
        </>
    )
}