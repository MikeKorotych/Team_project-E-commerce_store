import { Outlet } from 'react-router';
import { Header } from './components/Header';

function App() {
  return (
    <div>
      <Header />

      <div className="max-w-[1200px] px-[32px] mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
