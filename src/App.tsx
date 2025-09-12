import { ModeToggle } from './components/mode-toggle';
import { Button } from './components/ui/button';

function App() {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <ModeToggle />
      <Button>Button</Button>
    </div>
  );
}

export default App;
