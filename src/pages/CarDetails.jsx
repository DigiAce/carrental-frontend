import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Users,
  Settings,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
} from "lucide-react";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}/api`;

/* ================= FALLBACK IMAGES ================= */

const PLACEHOLDER_CAR_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";

const PLACEHOLDER_ERROR_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23fef2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23dc2626'%3EImage Error%3C/text%3E%3C/svg%3E";

/* ================= COMPONENT ================= */

export default function CarDetails() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slider state
  const [activeIndex, setActiveIndex] = useState(0);

  // Lightbox
  const [lightbox, setLightbox] = useState({
    open: false,
    index: 0,
  });

  /* ============ GET IMAGES WITH FALLBACK ============ */

  const getCarImages = (car) => {
    if (!car) return [PLACEHOLDER_CAR_IMAGE];

    const imgs = [];

    if (Array.isArray(car.images)) {
      imgs.push(...car.images.filter((i) => typeof i === "string"));
    }

    if (car.imageUrl && !imgs.includes(car.imageUrl)) {
      imgs.unshift(car.imageUrl);
    }

    return imgs.length ? imgs : [PLACEHOLDER_CAR_IMAGE];
  };

  /* ============ FETCH CAR ============ */

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/cars/${carId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load car");
        }

        setCar(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (carId) loadCar();
  }, [carId]);

  const images = useMemo(() => getCarImages(car), [car]);

  // Reset slider when images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error || "Car not found"}
      </div>
    );
  }

  const title = `${car.brand} ${car.model}`;
  const price = `₹${car.price?.toLocaleString()}`;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= IMAGE SLIDER ================= */}
          <div className="lg:col-span-2">

            <div className="relative rounded-lg overflow-hidden">

              {/* Main Image */}
              <img
                src={images[activeIndex]}
                className="w-full h-[420px] object-cover cursor-pointer"
                onClick={() =>
                  setLightbox({ open: true, index: activeIndex })
                }
                onError={(e) => {
                  e.target.src = PLACEHOLDER_ERROR_IMAGE;
                }}
              />

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIndex(
                        (activeIndex - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                      i === activeIndex
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setActiveIndex(i)}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_ERROR_IMAGE;
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ================= INFO ================= */}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-xl text-blue-600 font-semibold mt-2">{price}</p>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <Info label="Fuel" value={car.fuelType} />
              <Info label="Mileage" value={`${car.mileage} km`} />
              <Info label="Transmission" value={car.transmission} />
              <Info label="Seats" value={car.seatingCapacity} />
              <Info label="Owners" value={car.owners} />
              <Info label="Location" value={car.location} />
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="tel:9876543210"
                className="block text-center bg-blue-600 text-white py-3 rounded"
              >
                Call Now
              </a>

              <a
                href={`https://wa.me/919876543210?text=Interested in ${title}`}
                className="block text-center bg-green-500 text-white py-3 rounded"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {lightbox.open && (
        <Lightbox
          images={images}
          startIndex={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Info({ label, value }) {
  return (
    <div className="bg-gray-100 p-3 rounded">
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold">{value || "N/A"}</p>
    </div>
  );
}

/* ================= LIGHTBOX ================= */

function Lightbox({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [images, onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

      <button
        className="absolute top-5 right-5 text-white text-3xl"
        onClick={onClose}
      >
        ✕
      </button>

      <img
        src={images[index]}
        className="max-w-[90%] max-h-[90%] object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setIndex((index - 1 + images.length) % images.length)
            }
            className="absolute left-5 text-white text-4xl"
          >
            ‹
          </button>

          <button
            onClick={() =>
              setIndex((index + 1) % images.length)
            }
            className="absolute right-5 text-white text-4xl"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
