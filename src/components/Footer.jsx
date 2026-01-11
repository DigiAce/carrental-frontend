const Footer = () => {
  return (
    <footer className="bg-[#0b0c10] text-gray-300 py-16 relative overflow-hidden">
      {/* Subtle blue glow background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0056B3]/10 via-[#00AEEF]/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              <span className="text-[#00AEEF]">SML</span> Cars
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              15+ years of legacy, thousands of happy customers, and the same
              old trust — redefining pre-owned car excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Cars", href: "/cars" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-[#00AEEF] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                44, 2nd Main Rd, behind Dr. Kamakshi Memorial Hospital, Ram Nagar South Extension, Chennai, Tamil Nadu 600100
              </li>
              <li>
                <span className="font-medium text-gray-200">Phone: </span>
                <a
                  href="tel:+916384184188"
                  className="text-[#00AEEF] hover:text-[#0056B3] transition-colors"
                >
                  +91 63841 84188
                </a>
              </li>
              <li>
                <span className="font-medium text-gray-200">Email: </span>
                <a
                  href="mailto:info@premiumauto.com"
                  className="text-[#00AEEF] hover:text-[#0056B3] transition-colors"
                >
                  info@premiumauto.com
                </a>
              </li>
              <li className="text-gray-400">Mon–Sun: 9:00 AM – 8:00 PM</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-[#00AEEF] transition">Buy Pre-Owned Cars</li>
              <li className="hover:text-[#00AEEF] transition">Sell Your Car</li>
              <li className="hover:text-[#00AEEF] transition">Car Financing</li>
              <li className="hover:text-[#00AEEF] transition">Trade-In Services</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">SML Cars</span>. All
            rights reserved.
          </p>
          <p className="mt-1 bg-gradient-to-r from-[#00AEEF] to-[#0056B3] bg-clip-text text-transparent font-semibold">
            Driven by trust & innovation 🚗
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
