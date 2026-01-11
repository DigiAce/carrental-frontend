import { Award, Shield, Users, CheckCircle, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Integrity",
      desc: "Built on 15+ years of honest dealings and transparent practices.",
    },
    {
      icon: Heart,
      title: "Customer First",
      desc: "Your satisfaction is our top priority — we treat you like family.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      desc: "Every vehicle undergoes rigorous inspection and certification.",
    },
    {
      icon: Users,
      title: "Expert Team",
      desc: "Knowledgeable professionals dedicated to helping you choose right.",
    },
  ];

  const milestones = [
    { year: "1934", event: "SML Cars Founded" },
    { year: "1970", event: "Expanded to 5 Locations" },
    { year: "1995", event: "Introduced Quality Certification" },
    { year: "2010", event: "Reached 1000+ Happy Customers" },
    { year: "2024", event: "Celebrating 15+ Years of Excellence" },
  ];

  const achievements = [
    "Over 2000 cars sold",
    "1000+ satisfied customers",
    "15+ Years of legacy",
    "100% quality certified vehicles",
    "24/7 customer support",
    "Industry-leading warranty programs",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100 text-center">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-[#0056B3]">SML Cars</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A legacy of trust, excellence, and commitment to automotive
            perfection spanning decades.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-20 bg-white/70 backdrop-blur-xl border-y border-blue-100">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0056B3]">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Welcome to{" "}
                <span className="text-[#00AEEF] font-semibold">SML Cars</span>,
                your trusted partner in finding the perfect vehicle. Since 1934,
                we've been serving with dedication, transparency, and integrity.
              </p>
              <p>
                What began as a small family business has evolved into one of
                the region’s most trusted names in pre-owned cars.
              </p>
              <p>
                Our goal is simple — make car buying and selling easy,
                transparent, and enjoyable with quality vehicles at fair prices.
              </p>
              <p>
                Today, after 15+ years of excellence, our values remain
                unchanged: honesty, quality, and customer satisfaction first.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Our showroom"
              className="rounded-2xl shadow-2xl border border-blue-100"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#0056B3] to-[#00AEEF] text-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold">15+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/40 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-[#0b0c10]">
            Our Core Values
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide every move we make.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl border border-blue-100 hover:border-[#00AEEF] hover:shadow-lg hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-[#00AEEF]/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#0056B3]" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-white text-gray-900">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#0056B3]">
            Our Journey Through Time
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#00AEEF]/30"></div>
            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-8 ${
                    i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      i % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="bg-blue-50/70 backdrop-blur-md p-6 rounded-xl border border-blue-100 inline-block hover:border-[#00AEEF] transition-all">
                      <p className="text-3xl font-bold text-[#0056B3] mb-2">
                        {milestone.year}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {milestone.event}
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-[#00AEEF] rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#0b0c10]">
            Our Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#0056B3] flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">{achievement}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl mb-6 text-gray-800">
              Ready to experience the SML Cars difference?
            </p>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#0056B3] to-[#00AEEF] text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
