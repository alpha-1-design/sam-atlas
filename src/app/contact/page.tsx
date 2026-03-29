"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] py-20">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-center mb-12">
            Have questions? Need support? I'm here to help.
          </p>

          {submitted ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-gray-400">
                I'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Select a topic</option>
                  <option value="support">Product Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="refund">Refund Request</option>
                  <option value="business">Business Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  placeholder="Tell me how I can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Or email directly: kwaku09k@gmail.com
              </p>
            </form>
          )}

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="card p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-gray-400">kwaku09k@gmail.com</p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-semibold mb-1">Response Time</h3>
              <p className="text-sm text-gray-400">Within 24 hours</p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-sm text-gray-400">Ghana, West Africa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
