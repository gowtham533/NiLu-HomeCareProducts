// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="mt-20 px-4">

      <div className="
        max-w-7xl mx-auto p-10
        
        rounded-3xl
        
        bg-gradient-to-r from-purple-100/70 to-green-100/70
        backdrop-blur-lg 
        backdrop-saturate-150
        
        border border-white/40
        shadow-lg
      ">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Join the Nilu Family
            </h2>
            <p className="text-gray-600 text-sm">
              Get updates & offers
            </p>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-full bg-white/90 outline-none w-full"
            />
            <button className="
              px-6 rounded-r-full 
              bg-gradient-to-r from-purple-600 to-green-500 
              text-white font-semibold
              hover:scale-105 transition
            ">
              Subscribe
            </button>
          </div>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-8 text-gray-700">

          <div>
            <h1 className="text-xl font-bold text-purple-600">            
            <img className=" h-30" src="/nilu logo-Photoroom.png" alt="" /></h1>
            <p className="text-sm mt-2">
              Premium homecare products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Links</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li className="hover:text-purple-600 cursor-pointer">Home</li>
              <li className="hover:text-purple-600 cursor-pointer">Products</li>
              <li className="hover:text-purple-600 cursor-pointer">Offers</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Support</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Contact</h3>
            <p className="text-sm mt-2">support@nilu.com</p>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;