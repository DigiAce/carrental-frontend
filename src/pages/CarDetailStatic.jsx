import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Fuel, Gauge, Users, Settings, MapPin, Calendar, Phone, MessageCircle } from "lucide-react";

const CARS = [
  {
    id: "1",
    brand: "Hyundai",
    model: "Creta",
    variant: "",
    price: 0,
    year: 2021,
    fuelType: "Diesel",
    mileage: null,
    transmission: "Manual",
    owners: "Single Owner",
    location: "Chennai",
    color: "White",
    seatingCapacity: 5,
    bodyType: "SUV",
    features: ["Airbags", "ABS", "Cruise Control", "Alloy Wheels"],
    images: [
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-front.jpg?updatedAt=1763147166361",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-left.jpg?updatedAt=1763147166307",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-dash.jpg?updatedAt=1763147166137",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-back.jpg?updatedAt=1763147165393",
    ],
  },
  {
    id: "2",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX",
    price: 0,
    year: 2021,
    fuelType: "Diesel",
    mileage: 79800,
    transmission: "Manual",
    owners: "Single Owner",
    location: "Chennai",
    color: "Blue",
    seatingCapacity: 5,
    bodyType: "SUV",
    features: ["Airbags", "Touchscreen", "Cruise Control"],
    images: [
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-front.jpg?updatedAt=1763147166361",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-left.jpg?updatedAt=1763147166307",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-dash.jpg?updatedAt=1763147166137",
      "https://ik.imagekit.io/gat7a1q6g/carimages/creta-back.jpg?updatedAt=1763147165393",
    ],
  },
  {
    id: "3",
    brand: "Tata",
    model: "Harrier",
    variant: "XZA+",
    price: 0,
    year: 2022,
    fuelType: "Diesel",
    mileage: 44500,
    transmission: "Automatic",
    owners: "Single Owner",
    location: "Chennai",
    color: "Gray",
    seatingCapacity: 5,
    bodyType: "SUV",
    features: ["Sunroof", "Touchscreen", "ABS", "Traction Control"],
    images: [
      "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-front.jpg?updatedAt=1763147166332",
      "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-left.jpg?updatedAt=1763147166362",
      "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-dash.jpg?updatedAt=1763147166039",
      "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-back.jpg?updatedAt=1763147165763",
    ],
  },
  {
    id: "4",
    brand: "Hyundai",
    model: "Aura",
    variant: "SX+",
    price: 0,
    year: null,
    fuelType: "Diesel",
    mileage: 27800,
    transmission: "Automatic",
    owners: "Single Owner",
    location: "Chennai",
    color: "Silver",
    seatingCapacity: 5,
    bodyType: "Sedan",
    features: ["Airbags", "Touchscreen", "Cruise Control"],
    images: [
      "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-back.jpg?updatedAt=1763147165763",
      "https://ik.imagekit.io/gat7a1q6g/carimages/aura-back.jpg?updatedAt=1763147165128",
      "https://ik.imagekit.io/gat7a1q6g/carimages/aura-dash.jpg?updatedAt=1763147165123",
      "https://ik.imagekit.io/gat7a1q6g/carimages/aura-left.jpg?updatedAt=1763147165550",
    ],
  },
  {
    id: "5",
    brand: "Mahindra",
    model: "XUV 700",
    variant: "AX5",
    price: 0,
    year: 2022,
    fuelType: "Diesel",
    mileage: 58700,
    transmission: "Manual",
    owners: "Single Owner",
    location: "Chennai",
    color: "Black",
    seatingCapacity: 5,
    bodyType: "SUV",
    features: ["ABS", "Airbags", "Touchscreen", "Bluetooth"],
    images: [
      "https://ik.imagekit.io/gat7a1q6g/carimages/xuv-front.jpg?updatedAt=1763147166423",
      "https://ik.imagekit.io/gat7a1q6g/carimages/xuv-left.jpg?updatedAt=17631471663063",
      "https://ik.imagekit.io/gat7a1q6g/carimages/xuv-dash.jpg?updatedAt=1763147165529",
    //   "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
];

export default function CarDetailStatic() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const car = CARS.find((c) => c.id === carId);

  const [activeImage, setActiveImage] = useState(0);

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-900 text-xl">
        Car Not Found
      </div>
    );

  const title = `${car.brand} ${car.model} ${car.variant}`;
  const images = car.images?.length ? car.images : [car.images];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-6 px-6 shadow-md">
        <button
          onClick={() => navigate("/cars")}
          className="flex items-center gap-2 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cars
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-10 md:flex md:gap-10 items-start">
        {/* Left - Image */}
        <div className="md:flex-1 relative">
          <img
            src={images[activeImage]}
            alt={title}
            className="w-full h-96 md:h-[500px] object-cover rounded-3xl shadow-lg transition-all"
          />

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-16 object-cover rounded-lg cursor-pointer transition-all border ${
                    activeImage === idx
                      ? "border-blue-600 shadow-md"
                      : "border-gray-300 opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="md:flex-1 mt-8 md:mt-0">
          <h1 className="text-4xl font-bold text-blue-900">{title}</h1>
          <p className="text-2xl text-blue-600 font-semibold mt-2">
            {car.price ? `₹${car.price.toLocaleString()}` : "Price on Request"}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-blue-700">
            <Spec icon={<Fuel />} label="Fuel" value={car.fuelType} />
            <Spec icon={<Gauge />} label="Mileage" value={car.mileage ? `${car.mileage} km` : "N/A"} />
            <Spec icon={<Settings />} label="Transmission" value={car.transmission} />
            <Spec icon={<Users />} label="Seats" value={car.seatingCapacity} />
            <Spec icon={<Users />} label="Owners" value={car.owners} />
            <Spec icon={<MapPin />} label="Location" value={car.location} />
            <Spec icon={<Calendar />} label="Year" value={car.year || "N/A"} />
            <Spec
              icon={<div className="w-4 h-4 rounded-full bg-blue-600" />}
              label="Color"
              value={car.color}
            />
          </div>

          {/* Features */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Features</h2>
            <div className="flex flex-wrap gap-3">
              {car.features.map((f, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm shadow-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp & Call Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.link/pzu1wz`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <a
              href="tel:+916384184188"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              <Phone className="w-5 h-5" /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-blue-600 mb-1">{icon}</div>
      <div className="text-sm text-blue-700">{label}</div>
      <div className="font-semibold text-blue-900">{value}</div>
    </div>
  );
}
