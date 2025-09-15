import { Outlet } from 'react-router';
import { Header } from './components/Header';

function App() {
  return (
    <div className="">
      <Header />

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
