import { Outlet } from 'react-router';
import { Header } from './components/Header';

function App() {
  return (
    <div>
      <Header />

      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] min-[1200px]:py-[56px] px-4 py-8 sm:px-8 sm:py-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
