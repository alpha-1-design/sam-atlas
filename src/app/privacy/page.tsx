export const metadata = {
  title: "Privacy Policy | Sam Atlas",
  description: "How Sam Atlas collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="card space-y-6 text-gray-300">
            <p className="text-sm text-gray-500">Last updated: March 28, 2026</p>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Information I Collect</h2>
              <p>
                When you make a purchase, I collect: your email address (for delivery), payment information 
                (processed securely by Paystack), and any information you provide voluntarily.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How I Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To deliver your purchased products</li>
                <li>To send purchase confirmations and receipts</li>
                <li>To respond to your support requests</li>
                <li>To improve my products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Payment Processing</h2>
              <p>
                All payments are processed by Paystack, a secure payment processor. I do not store your 
                credit card or payment details on my servers. Paystack's privacy policy governs their 
                handling of your payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p>
                I use industry-standard security measures to protect your data. However, no method of 
                transmission over the internet is 100% secure, and I cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Cookies</h2>
              <p>
                My website may use cookies to improve your browsing experience. You can disable cookies 
                in your browser settings if you prefer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
              <p>
                I use third-party services including Paystack (payments), Vercel (hosting), and email 
                services. Each has their own privacy policies governing how they handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <p>
                You have the right to request access to, correction of, or deletion of your personal data. 
                To exercise these rights, contact me at kwaku09k@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
              <p>
                I may update this policy from time to time. Changes will be posted on this page with an 
                updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p>
                For questions about this privacy policy, contact: kwaku09k@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
