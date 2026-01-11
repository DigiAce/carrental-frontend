import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: "", phone: "", city: "" });
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6 text-[#0056B3]" />,
      title: "Our Location",
      desc: "44, 2nd Main Rd, behind Dr. Kamakshi Memorial Hospital, Ram Nagar South Extension, Chennai, Tamil Nadu 600100",
    },
    {
      icon: <Phone className="w-6 h-6 text-[#0056B3]" />,
      title: "Call Us",
      desc: "+91 63841 84188",
    },
    {
      icon: <Mail className="w-6 h-6 text-[#0056B3]" />,
      title: "Email Us",
      desc: "info@premiumauto.com",
    },
  ];

  return (
    <section className="bg-white text-gray-800">
      {/* Header Section with Background */}
      <div className="relative h-[60vh] flex flex-col justify-center items-center text-center overflow-hidden rounded-b-3xl shadow-sm">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
          alt="contact background"
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-95"
        />

        {/* Soft gradient tint for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-white/80 backdrop-blur-sm"></div>

        {/* Text content */}
        <h1 className="relative text-5xl md:text-6xl font-bold text-gray-900 mb-4 drop-shadow-sm">
          Let’s <span className="text-[#0056B3]">Connect</span>
        </h1>
        <p className="relative text-gray-700 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          We’d love to hear from you — just a few quick details away.
        </p>
      </div>

      {/* Contact Info */}
      <div className="container mx-auto px-6 lg:px-16 py-20">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {contactDetails.map((info, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">{info.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {info.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {info.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Elegant Form */}
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-10 transition-all">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full border-b border-gray-400 bg-transparent focus:border-[#0056B3] focus:outline-none py-3 placeholder-gray-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full border-b border-gray-400 bg-transparent focus:border-[#0056B3] focus:outline-none py-3 placeholder-gray-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
                className="w-full border-b border-gray-400 bg-transparent focus:border-[#0056B3] focus:outline-none py-3 placeholder-gray-500"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="mt-4 px-10 py-3 rounded-full bg-[#0056B3] text-white font-semibold hover:bg-[#004494] transition-transform transform hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Map */}
        <div className="mt-20 overflow-hidden rounded-3xl shadow-md border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124426.6800911364!2d80.12482304315974!3d12.950482558303902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525dbcba8045bb%3A0xef445cf89bf34992!2sSML%20CARS!5e0!3m2!1sen!2sin!4v1762910485709!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
