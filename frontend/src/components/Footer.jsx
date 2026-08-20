import { Link } from "react-router-dom";

function Footer() {
  const handleSocialClick = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold">NovaTrend</h3>
            <p className="mt-4 text-sm text-gray-400">
              Your one-stop shop for the latest trends and modern lifestyle products.
            </p>
            <div className="mt-6 flex gap-4">
              <button type="button" onClick={handleSocialClick} aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button type="button" onClick={handleSocialClick} aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button type="button" onClick={handleSocialClick} aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.04-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Shop</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?sort=newest" className="text-sm text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?sort=best-selling" className="text-sm text-gray-400 hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Support</h4>
            <ul className="mt-4 space-y-2">
              <li><button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
              <li><button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</button></li>
              <li><button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">Shipping</button></li>
              <li><button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">Returns</button></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay Updated</h4>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe to get special offers, free giveaways, and deals.
            </p>
          <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition-colors shrink-0 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              © 2025 NovaTrend. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
              <button type="button" onClick={handleSocialClick} className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
