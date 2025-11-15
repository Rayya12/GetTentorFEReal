import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import axios from "axios";



export default function(){
    const [otp,setOtp] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const [successMessage,setSuccessMessage] = useState("");
    const {state} = useLocation();
    const navigate = useNavigate();

    const handleVerifikasi = async (e) => {
        e.preventDefault();
        
        try{
            const response =await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/forgotPassword${state?.role}/verifyOTP`,{
                email : state?.email,
                otp : Number(otp)
            })
            
            const token = response.data.resetToken;
            const message = `Otentifikasi berhasil`; 
            setSuccessMessage(message);
            

            setTimeout(()=>{
                navigate("/changePassword",{state:{
                    role:state?.role,
                    token:token
                }})
            },2000)

        }catch(error){
            const message = error.response?.data?.error || error.message || "OTP gagal. Silakan coba lagi.";
            setErrorMessage(message);
        }

    }

    return(
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="w-full max-w-6xl h-full bg-white rounded-lg shadow-lg flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side */}
                <div className="hidden lg:block lg:w-1/2 rounded-l-4xl h-auto">
                    <img src="/images/Frame 7.png" alt="Gambar getTentor" className="bg-blue bg-cover w-full h-full "/>
                </div>

                {/* Right side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-3">
                    <h1 className="text-gray-900 text-4xl font-bold mb-6">Verifikasi OTP</h1>
                    <h2 className="text-gray-900 text-2xl font-semibold mb-6">Masukkan OTP yang telah dikirim ke email</h2>

                    <div className="space-y-6">
                        {errorMessage && <div className="w-full bg-red-300 border-red-500 text-red-700 rounded-lg px-4 py-3">{errorMessage}</div>}
                        {successMessage && <div className="w-full bg-green-300 border-green-500 text-green-700 rounded-lg px-4 py-3">{successMessage}</div>}

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-900 ">OTP</label>
                            <input id="otp" type="text" className="mt-1 w-full px-4 py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue" value={otp} onChange={(e)=>{
                                const val = e.target.value;
                                if (/^\d{0,6}$/.test(val)){
                                    setOtp(val)
                                }
                            }} maxLength={6} placeholder="Masukkan 6 digit" required/>
                            <button className="mt-4 w-full bg-blue text-white px-4 py-2 text-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue" onClick={handleVerifikasi}>Verifikasi OTP</button>
                        </div> 
                        
                    </div>
                </div>

                
            </div>
        </div>
    )

} 