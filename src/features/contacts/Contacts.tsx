import ProductPageNav from "@/components/ProductPageNav";

export const Contacts = () => (
  <>
    <ProductPageNav category="Contacts" />

    <h1 className="page-title">Contacts</h1>

    <div className="bg-card p-5 mt-10 overflow-x-auto rounded-2xl">
      <h1 className="text-4xl">Nice Gadgets Contacts</h1>

      <div className="flex flex-col my-5 gap-3 min-w-[400px]">
        <h2 className="text-2xl">Store Address</h2>
        <p className="mx-5">
          123 Main Street, Kyiv, Kyiv Oblast, 01008, Ukraine
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">Phone</h2>
        <p className="mx-5">
          +380 44 123 45 67
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">Email</h2>
        <p className="mx-5">
          support@nicegadgets.ua
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">Social Media</h2>
        <p className="mx-5">
          Instagram: @nicegadgets <br />
          Facebook: facebook.com/nicegadgets <br />
          Telegram: t.me/nicegadgets
        </p>
      </div>
    </div>
  </>
);