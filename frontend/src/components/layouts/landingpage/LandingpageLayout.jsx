import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className='font-[Nunito] bg-[#fdf5ee] text-[#7a3b1e] overflow-x-hidden'>
      <Navbar />

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
