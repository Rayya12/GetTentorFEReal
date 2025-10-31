import { Link } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard.jsx';
import { useUser } from "@/contexts/UserContextProvider";

const HomepageNonLogin = () => {


  const { user } = useUser();
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null && token !== '';

  if(isAuthenticated) {
    if (user?.role === "mentee"){
      return <Dashboard/>
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Header */}
      <header className="bg-sky-200 p-4 px-6 text-white flex justify-between items-center shadow-md">
        <img crossOrigin="anonymous" src={`/images/gettentor.png`} alt="GetTentor Logo" className="h-10" />
        <div>
          <Link to="/register">
            <button className="bg-white text-black font-bold px-5 py-2 rounded mr-3 shadow hover:bg-gray-100 transition">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-blue text-white font-bold px-5 py-2 rounded shadow hover:bg-blue transition">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={`/images/profile-image.png`}
              alt="Hero"
              className="object-cover w-full max-w-[400px] h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-4xl font-bold mb-4">
              Tentoring dengan Pembimbing berdedikasi, ada di genggaman anda.
            </h1>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Kesulitan dalam belajar? Ingin mempelajari bagaimana bisa belajar secara efektif? 
              Tertarik mempelajari keterampilan yang banyak dicari? <br />
              Bekerja cerdas dengan tentor online yang mendampingi Anda, yang menawarkan saran dan panduan 
              ahli yang sesuai dengan semangat Anda. Jadilah tak terhentikan dengan <strong>GetTentor</strong>.
            </p>
            <ul className="flex flex-col gap-2 font-semibold text-xl">
              <li className="flex items-center gap-2">
                <img crossOrigin="anonymous" src={`/images/check-symbol-isolated.png`} alt="Check" className="w-10 h-10" />
                Tentor berpengalaman
              </li>
              <li className="flex items-center gap-2">
                <img crossOrigin="anonymous" src={`/images/check-symbol-isolated.png`} alt="Check" className="w-10 h-10" />
                Jadwal tentoring fleksibel
              </li>
            </ul>
          </div>
        </section>

        {/* Tentor Cards */}
        <section className="text-center mb-20">
          <h2 className="text-2xl font-bold mb-10">
            Temukan Tentor Ahli di Mata Kuliah Pilihan Anda!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { img: '/images/coding.jpg', label: 'Coding' },
              { img: '/images/math.jpg', label: 'Math' },
              { img: '/images/design.jpg', label: 'Design' },
            ].map((item, index) => (
              <div key={index}>
                <img
                  src={item.img}
                  alt={item.label}
                  className="mx-auto h-60 w-auto rounded-md hover:scale-105 transition-transform duration-300"
                />
                <p className="mt-2 text-lg font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

        </section>

        {/* CTA Section */}
        <section className="bg-blue text-white p-10 rounded-lg mb-20 text-justify">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Komunitas GetTentor & mulai perjalanan pembelajaran anda!</h2>
          <p className="text-lg mb-6">
            Siap memulai perjalanan belajar dan pengembangan diri Anda? Temukan mentor berpengalaman yang siap membimbing Anda mencapai tujuan. Login atau Daftar sekarang untuk mulai pencarian mentor yang paling sesuai dengan kebutuhan Anda dan wujudkan potensi terbaik Anda bersama mereka.
          </p>

          <div className="flex items-center space-x-8">
            <Link to="/login">
              <button className="bg-sky-300 text-black px-8 py-3 rounded-lg font-bold hover:bg-sky-200 transition">
                Login
              </button>
            </Link>
            <p className="text-white text-base whitespace-nowrap">
              belum punya akun?{' '}
              <Link to="/register" className="text-orange-300 font-semibold hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </section>





        {/* Testimonial Section */}
        <section className="max-w-3xl mx-auto bg-green-100 p-8 rounded-lg text-center shadow-md mb-16">
          <div className="text-yellow-500 text-xl mb-3">★★★★★</div>
          <p className="text-gray-800 text-md italic mb-4">
            “Memiliki akses ke pengetahuan dan pengalaman para tentor di GetTentor adalah kesempatan emas yang tidak boleh saya lewatkan. 
            Berkat tentor saya, saya bisa mempelajari dan menguasai skill AI dengan mudah.”
          </p>
          <p className="text-green-800 font-semibold">Brian Musangking</p>
          <p className="text-gray-600 text-sm">Mentee</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sky-200 text-black px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          {/* Kiri: About Us + Narasi */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">About Us</h2>
            <p className="text-sm text-gray-800 text-justify">
              GetTentor is dedicated to connecting students with the best tutors 
              for personalized and effective learning experiences. Our mission is 
              to empower education through trusted mentorship.
            </p>
          </div>

          {/* Kanan: Ikon Sosial + Copyright */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-3">
            <div className="flex justify-center md:justify-end gap-5 text-xl w-full">
              <a href="#" aria-label="Facebook" className="hover:text-blue transition-colors">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-600 transition-colors">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue transition-colors">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue transition-colors">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <p className="text-xs text-gray-700 text-center md:text-right w-full">
              &copy; {new Date().getFullYear()} GetTentor. All rights reserved.
            </p>
          </div>

        </div>
      </footer>


    </div>
  );
};

export default HomepageNonLogin;
