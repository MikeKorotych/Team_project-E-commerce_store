import { Outlet } from 'react-router';
import { Header } from './components/Header';
import Footer from './components/Fotter';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow max-w-[1200px] px-[32px] mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
