import { ModeToggle } from './components/mode-toggle';
import { Button } from './components/ui/button';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

function App() {
  return (
    <div className="max-w-[100vw] h-[100vh] flex flex-col gap-4 justify-center items-center">
      <ModeToggle />
      <Button className="test">Button</Button>
      <span className="text-2xl font-bold ">test text</span>

      <div className="">
        <Carousel className="w-[600px]">
          <CarouselContent>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="rounded-[0px] h-full max-md:hidden" />
          <CarouselNext className="rounded-[0px] h-full" />
        </Carousel>
      </div>
    </div>
  );
}

export default App;
