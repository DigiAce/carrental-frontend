import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Fuel, Gauge, Users, Settings, MapPin, Calendar, Phone, MessageCircle } from "lucide-react";

const BACKEND_URL = "http://localhost:5001/api";

// Fallback images (inline SVG)
const PLACEHOLDER_CAR_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' rx='12' fill='%23f3f4f6'/%3E%3Cpath d='M200,300 L600,300 L580,400 L220,400 Z' fill='%236b7280'/%3E%3Ccircle cx='280' cy='450' r='30' fill='%23374151'/%3E%3Ccircle cx='520' cy='450' r='30' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";

const PLACEHOLDER_ERROR_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23fef2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23dc2626'%3EImage Error%3C/text%3E%3C/svg%3E";

export default function CarDetails() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  // Get car images with fallback
  const getCarImages = (car) => {
    if (!car) return [PLACEHOLDER_CAR_IMAGE];
    
    const images = [];
    if (Array.isArray(car.images) && car.images.length > 0) {
      images.push(...car.images.filter(img => img && typeof img === 'string'));
    }
    if (car.imageUrl && !images.includes(car.imageUrl)) images.unshift(car.imageUrl);
    if (images.length === 0) images.push(PLACEHOLDER_CAR_IMAGE);
    return images;
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError("");
        // 🚨 This is the line that caused the 404 error, now fixed by the backend update.
        const response = await fetch(`${BACKEND_URL}/cars/${carId}`); 
        if (!response.ok) throw new Error(`Failed to fetch car: ${response.status}`);
        
        const data = await response.json();
        
        // This line relies on the backend returning { success: true, data: ... }
        if (!data.success) throw new Error(data.error || "Failed to load car details");
        
        setCar(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (carId) fetchCarDetails();
  }, [carId]);

  const images = useMemo(() => getCarImages(car), [car]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-lg font-medium text-blue-600 animate-pulse">
            Loading car details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Car Not Found</h1>
          <p className="text-blue-700 mb-6">
            {error || "The car you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/cars")}
              className="bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = `${car.brand || ""} ${car.model || ""}`.trim();
  const price = car.price ? `₹${car.price.toLocaleString()}` : "Price not available";
  const contactNumber = "+91 98765 43210"; 
  const whatsappNumber = "919876543210"; 

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/cars")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cars
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Main Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-80 md:h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setLightbox({ open: true, index: 0 })}
                  onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }}
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      className={`rounded-lg overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${index === 0 ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setLightbox({ open: true, index })}
                    >
                      <img
                        src={image}
                        alt={`${title} - View ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }}
                      />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <button
                      className="rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 font-medium"
                      onClick={() => setLightbox({ open: true, index: 4 })}
                    >
                      +{images.length - 4} more
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Contact & Action */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">{price}</h2>
                <p className="text-blue-700">{car.available ? "Available for purchase" : "Currently Unavailable"}</p>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${contactNumber.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi! I'm interested in ${encodeURIComponent(title)} (${price})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Quick Info</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <InfoRow label="Brand" value={car.brand || "N/A"} />
                  <InfoRow label="Model" value={car.model || "N/A"} />
                  <InfoRow label="Year" value={car.year || "N/A"} />
                  <InfoRow label="Fuel Type" value={car.fuelType || "N/A"} />
                </div>
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="p-6 border-t border-blue-100">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{title}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-6">{price}</p>

            {/* Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SpecCard icon={<Fuel className="w-5 h-5 text-blue-600" />} label="Fuel Type" value={car.fuelType} />
              <SpecCard icon={<Gauge className="w-5 h-5 text-blue-600" />} label="Mileage" value={car.mileage ? `${car.mileage} km` : "N/A"} />
              <SpecCard icon={<Settings className="w-5 h-5 text-blue-600" />} label="Transmission" value={car.transmission} />
              <SpecCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Seating Capacity" value={car.seatingCapacity ? `${car.seatingCapacity} people` : "5 people"} />
              <SpecCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Owners" value={car.owners || "1st Owner"} />
              <SpecCard icon={<MapPin className="w-5 h-5 text-blue-600" />} label="Location" value={car.location || "Main Branch"} />
              <SpecCard icon={<Calendar className="w-5 h-5 text-blue-600" />} label="Year" value={car.year} />
              <SpecCard icon={<div className="w-5 h-5 rounded-full border-2" style={{ borderColor: car.color ? 'currentColor' : '#3b82f6' }} />} label="Color" value={car.color || "White"} />
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Array.isArray(car.features) ? car.features : String(car.features).split(','))
                    .map(feature => feature.trim())
                    .filter(Boolean)
                    .map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-blue-50 text-blue-700 rounded-lg px-4 py-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SpecCard({ icon, label, value }) {
  if (!value || value === "N/A") return null;
  
  return (
    <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-sm text-blue-700 mb-1">{label}</div>
      <div className="font-semibold text-blue-900">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-1 border-b border-blue-100">
      <span className="text-blue-700">{label}:</span>
      <span className="font-medium text-blue-900">{value}</span>
    </div>
  );
}