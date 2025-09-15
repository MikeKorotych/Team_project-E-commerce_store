import { Outlet } from 'react-router';
import { Navbar } from './components/Header';

function App() {
  return (
    <div className="">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
