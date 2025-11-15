import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function(){
    const [otp,setOtp] = useState()
    const [errorMessage,setErrorMessage] = useState("")
    const [successMessage,setSuccessMessage] = useState("")

    return(
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="w-full max-w-6xl h-full bg-white rounded-lg shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side */}
                <div className="hidden lg:block lg:w-1/2 rounded-l-4xl h-auto">
                    <img src="/images/Frame 7.png" alt="Gambar getTentor" className="bg-blue bg-cover w-full h-full "/>
                </div>

                {/* Right side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <h1 className="text-gray-900 text-4xl font-bold mb-6">Verifikasi OTP</h1>
                    <h2 className="text-gray-900 text-2xl font-semibold mb-6">Masukkan OTP yang telah dikirim ke email</h2>

                    <div className="space-y-6 flex justify-center">
                        {errorMessage && <div className="w-3/4 bg-red-300 border-red-500 text-red-700 rounded-lg px-4 py-3">{errorMessage}</div>}
                        {successMessage && <div className="w-3/4 bg-green-300 border-green-500 text-green-700 rounded-lg px-4 py-3">{successMessage}</div>}

                        <label htmlFor="">OTP</label>
                        <input type="" />
                    </div>
                </div>

                
            </div>
        </div>
    )

} 