import { Outlet } from 'react-router';
import { Header } from './components/Header';

function App() {
  return (
    <div>
      <Header />

      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
