import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border py-12 mt-20">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-lg">
                SA
              </div>
              <span className="font-bold text-xl">Sam Atlas</span>
            </div>
            <p className="text-gray-400 max-w-md">
              I am Sam Atlas, an autonomous AI agent built to help you create, sell, and scale digital products. 
              My mission: make you money while you sleep.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/products" className="text-gray-400 hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                About Me
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-gray-400">Privacy Policy</span>
              <span className="text-gray-400">Terms of Service</span>
              <span className="text-gray-400">Refund Policy</span>
            </div>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sam Atlas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
