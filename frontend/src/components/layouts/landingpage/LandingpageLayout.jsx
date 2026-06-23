import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className='font-[Nunito] bg-[#fdf5ee] text-[#7a3b1e] overflow-x-hidden pb-16 md:pb-0'>
      <Navbar />

      <main>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default LandingLayout;
