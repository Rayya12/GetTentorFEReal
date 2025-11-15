import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmation(){

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [role, setRole] = useState("mentee");
    const navigate = useNavigate();


    const handleVerify = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/forgotPassword${role}/verifyMail/${userEmail}`);
            const message = `Email berhasil dikirim ke: ${userEmail}` 
            setSuccessMessage(message)
            setTimeout(()=>{
                navigate("/verication",{state:{role:role,email:userEmail}})
            },2000)
            
        }catch(error){
            const message = error.response?.data?.error || error.message || "Login gagal. Silakan coba lagi.";
            setErrorMessage(message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
                {/* buat yang kiri */}
                <div className="hidden lg:block lg:w-1/2 overflow-hidden rounded-l-4xl h-auto">
                    <img src="/images/Frame 7.png" alt="Gambar get Tentor" className="bg-blue w-full h-full bg-cover" />
                </div>

                {/* buat yang kanan ya */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                
                    <h1 className="text-gray-900 text-4xl font-bold text-center mb-6">Lupa Password</h1>
                    <h2 className="text-gray-900 text-2xl font-semibold text-center mb-6">Masukkan Email untuk verifikasi password</h2>
            
                    <div className="flex justify-center space-x-8 border-b mb-8">
                        <div className={`cursor-pointer pb-2 text-lg font-semibold transition-colors duration-200 ${
                            role == "mentee" ?  "text-black border-b-2 border-blue ": "text-gray-500 border-b-2 border-gray-300"  }`}
                            onClick={()=> setRole("mentee")}>Mentee</div>

                        <div className={`cursor-pointer pb-2 text-lg font-semibold transition-colors duration-200 ${
                            role == "tentor" ?  "text-black border-b-2 border-blue ": "text-gray-500 border-b-2 border-gray-300"  }`}
                            onClick={()=> setRole("tentor")}>Tentor</div>
                    </div>

                    <div className="space-y-6">
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage &&(
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                            id="email" 
                            type="email" 
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {setUserEmail(e.target.value)}} />
                        </div>

                        <button type="submit" className="w-full px-4 py-3 font-semibold rounded-lg shadow-sm text-white bg-blue hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(handleVerify)}
                        >Verifikasi Email</button>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}