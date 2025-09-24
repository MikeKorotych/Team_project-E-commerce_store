import ProductPageNav from "@/components/ProductPageNav";

export const Rights = () => (
  <>
    <ProductPageNav category="Rights" />

    <h1 className="page-title">Rights</h1>

    <div className="bg-card p-5 mt-10 overflow-x-auto rounded-2xl">
      <h1 className="text-4xl">Nice Gadgets Terms and Conditions</h1>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">1. General Provisions</h2>
        <p className="mx-5">
          1.1. These terms and conditions govern the purchase of products
          (iPhones and accessories) from our store. <br />
          1.2. By placing an order, the customer agrees to these terms and
          conditions. <br />
          1.3. The store reserves the right to change these terms without prior
          notice.
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">2. Orders and Payment</h2>

        <p className="mx-5">
          2.1. An order is considered accepted once confirmed by the store
          manager. <br />
          2.2. Payment can be made using available methods: online payment, bank
          card, or cash on delivery (if available). <br />
          2.3. All prices are listed in [specify currency] and include taxes
          unless otherwise stated. 
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">3. Delivery</h2>

        <p className="mx-5">
          3.1. Delivery will be made within the timeframe specified when placing
          the order. <br />
          3.2. The store is not responsible for delays caused by courier
          services or postal carriers. <br />
          3.3. Customers must check the product upon receipt for any visible
          damage. 
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">4. Returns and Warranty</h2>

        <p className="mx-5">
          4.1. Products are eligible for return or exchange according to
          applicable laws. <br />
          4.2. Returns are possible only if the original
          packaging, documents, and product condition are preserved. <br />
          4.3. iPhone warranty is provided by the manufacturer. The store assists with
          service center claims.
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">5. Liability</h2>

        <p className="mx-5">
          5.1. The store is not responsible for misuse of products contrary to
          the manufacturer’s instructions. <br />
          5.2. Any liability of the store is
          limited to the purchase price of the product. 
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">6. Privacy</h2>

        <p className="mx-5">
          6.1. The store will not disclose customer personal data to third
          parties, except as required by law. <br />
          6.2. Personal data is used solely
          for order processing and customer communication.
        </p>
      </div>

      <div className="flex flex-col my-5 gap-3">
        <h2 className="text-2xl">7. Delivery</h2>

        <p className="mx-5">
          7.1. All disputes are resolved through negotiations between the store
          and the customer. <br />
          7.2. If a dispute cannot be resolved amicably, it
          will be subject to the jurisdiction of the court where the store is
          located.
        </p>
      </div>
    </div>
  </>
);
