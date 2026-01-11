import React, { useState, useEffect } from "react";
import { Gauge, Fuel, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    transmission: "",
    priceRange: "",
  });

  const navigate = useNavigate();

  const PLACEHOLDER_CAR_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M100,120 L200,120 L190,150 L110,150 Z' fill='%236b7280'/%3E%3Ccircle cx='120' cy='160' r='15' fill='%23374151'/%3E%3Ccircle cx='180' cy='160' r='15' fill='%23374151'/%3E%3Ctext x='150' y='80' text-anchor='middle' font-family='Arial' font-size='14' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";

  const getCarImage = (car) => {
    let imageUrl = car.imageUrl || car.image;
    if (!imageUrl || imageUrl === "" || imageUrl === null || imageUrl === undefined) {
      return PLACEHOLDER_CAR_IMAGE;
    }
    if (typeof imageUrl === "string" && (imageUrl.startsWith("/uploads/") || imageUrl.includes("/uploads/"))) {
      return PLACEHOLDER_CAR_IMAGE;
    }
    if (typeof imageUrl === "string" && (imageUrl.includes("via.placeholder.com") || imageUrl.includes("placeholder.com") || imageUrl.includes("example.com"))) {
      return PLACEHOLDER_CAR_IMAGE;
    }
    if (typeof imageUrl === "string" && (imageUrl.startsWith("data:") || imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
      return imageUrl;
    }
    return PLACEHOLDER_CAR_IMAGE;
  };

  // Crucial: This function determines the ID sent to the backend. It uses $id from Appwrite.
  const getCarId = (car) => car.$id || car.id || Math.random().toString(36).substr(2, 9);

  const handleViewDetails = (car) => {
    const carId = getCarId(car);
    // Navigates to the /car/:carId route, e.g., /car/69176b2...
    navigate(`/car/${carId}`, { state: { car } });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/cars");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let carsArray = [];
      
      // Handle the new backend response format: { success: true, data: [...] }
      if (data.success && Array.isArray(data.data)) carsArray = data.data; 
      else if (Array.isArray(data)) carsArray = data;
      else if (data.documents && Array.isArray(data.documents)) carsArray = data.documents;
      else carsArray = [];
      
      setCars(carsArray);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    const priceMatch = () => {
      if (!filters.priceRange) return true;
      const [min, max] = filters.priceRange.split("-").map(Number);
      return car.price >= min && car.price <= max;
    };
    return (
      (filters.brand === "" || car.brand?.toLowerCase().includes(filters.brand.toLowerCase())) &&
      (filters.fuelType === "" || car.fuelType === filters.fuelType) &&
      (filters.transmission === "" || car.transmission === filters.transmission) &&
      priceMatch()
    );
  });

  const resetFilters = () => setFilters({ brand: "", fuelType: "", transmission: "", priceRange: "" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-lg font-medium text-blue-700 animate-pulse">🚗 Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Browse Our Premium Cars
          </h1>
          <p className="text-lg text-blue-700">
            Find your perfect ride from our curated collection
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-12 bg-white shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-900">Filter Your Search</h2>
            <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand */}
            <div>
              <label className="text-sm font-medium text-blue-500 mb-2 block">Car Brand</label>
              <input
                type="text"
                placeholder="Search by brand"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-sm font-medium text-blue-500 mb-2 block">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-sm font-medium text-blue-500 mb-2 block">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Transmissions</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="AMT">AMT</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-blue-500 mb-2 block">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Prices</option>
                <option value="0-100000">0 - 1 Lakh</option>
                <option value="100001-200000">1 - 2 Lakh</option>
                <option value="200001-500000">2 - 5 Lakh</option>
                <option value="500001-1000000">5 - 10 Lakh</option>
                <option value="1000001-5000000">10 - 50 Lakh</option>
                <option value="5000001-10000000">50 Lakh - 1 Cr</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-blue-700">
            Showing {filteredCars.length} of {cars.length} cars
          </p>
          <button
            onClick={fetchCars}
            className="text-sm bg-blue-200 hover:bg-blue-300 text-blue-900 px-4 py-2 rounded-md transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.map((car) => {
            const carId = getCarId(car);
            const carImage = getCarImage(car);

            return (
              <div
                key={carId}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={carImage}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = PLACEHOLDER_CAR_IMAGE; }}
                  />
                  <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
                    {car.year}
                  </span>
                  {!car.available && (
                    <span className="absolute top-4 left-4 bg-red-100 text-red-700 font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
                      Sold Out
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ₹{car.price?.toLocaleString()}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      <span>{car.mileage ? `${car.mileage} km` : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>{car.transmission || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{car.owners || "1st"} Owner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      <span>{car.fuelType || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(car)}
                    className={`w-full font-semibold py-2 rounded-md transition-colors ${
                      car.available
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                    disabled={!car.available}
                  >
                    {car.available ? "See Full Details" : "Not Available"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Cars;