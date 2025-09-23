

export const OrderItem = () => (
  <div className="w-full sm:max-w-[592px] xl:max-w-[752px] bg-card flex flex-col gap-3 border shadow-sm p-4">
    <div className="flex flex-row gap-4 max-sm:flex-col justify-between">
      <div className="flex flex-row gap-6 items-center max-sm:gap-[2vw]">
        <img
          src='https://placehold.co/250x350'
          alt='Product'
          className="h-20 w-20 object-contain"
        />

        <h2 className="text-[14px]/[21px] ">Iphone</h2>
      </div>

      <div className="flex justify-between items-center max-sm:mt-4 gap-4 xl:gap-[4vw]">
        <span className="font-bold text-[22px]/[140%]">
          $4324
        </span>
      </div>
    </div>
  </div>
);
