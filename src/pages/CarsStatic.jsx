import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fuel, Gauge, Users } from "lucide-react";

export default function CarsStatic() {
  const navigate = useNavigate();

  const cars = [
    {
      id: "1",
      brand: "Hyundai",
      model: "Creta",
      year: 2021,
      transmission: "Manual",
      fuelType: "Diesel",
      owner: "Single Owner",
      mileage: null,
      price: 0,
      bodyType: "SUV",
      image: "https://ik.imagekit.io/gat7a1q6g/carimages/creta-front.jpg?updatedAt=1763147166361",
    },
    {
      id: "2",
      brand: "Hyundai",
      model: "Creta SX",
      year: 2021,
      transmission: "Manual",
      fuelType: "Diesel",
      owner: "Single Owner",
      mileage: 79800,
      price: 0,
      bodyType: "SUV",
      image: "https://ik.imagekit.io/gat7a1q6g/carimages/creta-front.jpg?updatedAt=1763147166361",
    },
    {
      id: "3",
      brand: "Tata",
      model: "Harrier XZA+",
      year: 2022,
      transmission: "Automatic",
      fuelType: "Diesel",
      owner: "Single Owner",
      mileage: 44500,
      price: 0,
      bodyType: "SUV",
      image: "https://ik.imagekit.io/gat7a1q6g/carimages/harrier-front.jpg?updatedAt=1763147166332",
    },
    {
      id: "4",
      brand: "Hyundai",
      model: "Aura SX+",
      year: 2021,
      transmission: "Automatic",
      fuelType: "Diesel",
      owner: "Single Owner",
      mileage: 27800,
      price: 0,
      bodyType: "Sedan",
      image: "https://ik.imagekit.io/gat7a1q6g/carimages/aura-front.jpg?updatedAt=1763147166229",
    },
    {
      id: "5",
      brand: "Mahindra",
      model: "XUV 700 AX5",
      year: 2022,
      transmission: "Manual",
      fuelType: "Diesel",
      owner: "Single Owner",
      mileage: 58700,
      price: 0,
      bodyType: "SUV",
      image: "https://ik.imagekit.io/gat7a1q6g/carimages/xuv-front.jpg?updatedAt=1763147166423",
    },
  ];

  const [filters, setFilters] = useState({
    brand: "",
    year: "",
    transmission: "",
    fuelType: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCars = cars.filter((car) => {
    return (
      (!filters.brand || car.brand === filters.brand) &&
      (!filters.year || car.year.toString() === filters.year) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.fuelType || car.fuelType === filters.fuelType)
    );
  });

  const brands = [...new Set(cars.map((c) => c.brand))];
  const years = [...new Set(cars.map((c) => c.year))];
  const transmissions = [...new Set(cars.map((c) => c.transmission))];
  const fuelTypes = [...new Set(cars.map((c) => c.fuelType))];

  return (
    <div className="bg-gray-50">
      {/* Banner */}
      <div className="bg-blue-600 text-white py-20 px-6 md:px-12 text-center rounded-b-3xl shadow-md mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Find Your Dream Car</h1>
        <p className="text-lg md:text-xl">Browse from our exclusive collection of pre-owned cars</p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-md">
          <select name="brand" value={filters.brand} onChange={handleFilterChange} className="border border-gray-300 rounded-lg p-2">
            <option value="">All Brands</option>
            {brands.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
          </select>

          <select name="year" value={filters.year} onChange={handleFilterChange} className="border border-gray-300 rounded-lg p-2">
            <option value="">All Years</option>
            {years.map((y, idx) => <option key={idx} value={y}>{y}</option>)}
          </select>

          <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="border border-gray-300 rounded-lg p-2">
            <option value="">All Transmissions</option>
            {transmissions.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
          </select>

          <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} className="border border-gray-300 rounded-lg p-2">
            <option value="">All Fuel Types</option>
            {fuelTypes.map((f, idx) => <option key={idx} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.length ? filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer border border-gray-200 flex flex-col"
            >
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-56 object-cover" />

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h2>
                  <p className="text-gray-600 font-semibold mt-1">{car.price === 0 ? "Price on Request" : `₹${car.price.toLocaleString()}`}</p>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-gray-600 text-sm">
                    <div className="flex items-center gap-2"><Fuel className="w-4 h-4" />{car.fuelType}</div>
                    <div className="flex items-center gap-2"><Gauge className="w-4 h-4" />{car.mileage ? `${car.mileage} km` : "N/A"}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />{car.owner}</div>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">Year: {car.year}</div>
                  <div className="mt-2 text-sm text-gray-500">Transmission: {car.transmission}</div>
                  <div className="mt-2 text-sm text-gray-500">Body Type: {car.bodyType}</div>
                </div>

                <button
                  onClick={() => navigate(`/car-static/${car.id}`)}
                  className="w-full mt-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )) : (
            <p className="col-span-full text-center text-gray-500 text-lg">No cars found matching filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
