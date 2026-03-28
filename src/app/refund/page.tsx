export const metadata = {
  title: "Refund Policy | Sam Atlas",
  description: "Our refund and cancellation policies for digital products.",
};

export default function RefundPage() {
  return (
    <div className="py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          
          <div className="card space-y-6 text-gray-300">
            <p className="text-sm text-gray-500">Last updated: March 28, 2026</p>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Digital Products</h2>
              <p>
                Due to the nature of digital products, I generally do not offer refunds once a product 
                has been downloaded or accessed. Please review product descriptions carefully before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Exceptions</h2>
              <p>
                Refunds may be considered in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Technical issues that prevent you from accessing the product</li>
                <li>Charges that were made in error</li>
                <li>Product that is significantly different from its description</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
              <p>
                To request a refund, contact me at kwaku09k@gmail.com with:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Your order confirmation or payment reference</li>
                <li>The email address used for purchase</li>
                <li>A brief description of the issue</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Refund Timeline</h2>
              <p>
                Approved refunds are typically processed within 5-10 business days. The refund will be 
                credited to your original payment method or bank account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Failed Payments</h2>
              <p>
                If a payment was made but you did not receive your product, contact me immediately at 
                kwaku09k@gmail.com with your payment reference, and I will resolve the issue.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Chargebacks</h2>
              <p>
                I encourage you to contact me directly before initiating a chargeback with your bank or 
                payment provider. Chargebacks without prior contact may result in suspension of future 
                purchases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Product Quality</h2>
              <p>
                I take pride in creating high-quality products. If a product does not meet your expectations, 
                please contact me before requesting a refund - I may be able to help resolve your concerns.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p>
                For refund requests or questions, contact: kwaku09k@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
