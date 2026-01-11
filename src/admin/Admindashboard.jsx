import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// AdminDashboard.jsx
// Full working admin dashboard component with single/multiple image upload
// Assumes backend endpoints at http://localhost:5001/api

function AdminDashboard({ onLogout }) {
  const BACKEND_URL = "http://localhost:5001/api";
  const TOKEN_KEY = "token"; // confirmed by you

  const PLACEHOLDER_CAR_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8fafc'/%3E%3Cpath d='M80 120h140v40H80z' fill='%23e2e8f0'/%3E%3Ccircle cx='100' cy='140' r='20' fill='%23cbd5e1'/%3E%3Ccircle cx='200' cy='140' r='20' fill='%23cbd5e1'/%3E%3Cpath d='M120 100l60-20' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3C/svg%3E";
  const PLACEHOLDER_ERROR_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23fef2f2'/%3E%3Cpath d='M120 80l60 60m0-60l-60 60' stroke='%23dc2626' stroke-width='3' fill='none'/%3E%3Ctext x='150' y='170' text-anchor='middle' font-family='Arial' font-size='12' fill='%23dc2626'%3EImage Failed to Load%3C/text%3E%3C/svg%3E";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Multi-image state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); 

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    fuelType: "Gasoline",
    imageUrl: "",
    images: [],
    mileage: "",
    color: "White",
    transmission: "Manual",
    owners: "1st Owner",
    type: "Sedan",
    seatingCapacity: "5",
    location: "Main Branch",
    available: true,
    features: "",
  });

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
  const getCarId = (car) => car.$id || car.id;

  // Get primary image with better fallback
  const getPrimaryImage = (car) => {
    if (Array.isArray(car.images) && car.images.length > 0) return car.images[0];
    if (car.imageUrl) return car.imageUrl;
    return PLACEHOLDER_CAR_IMAGE;
  };

  // Get all images for a car
  const getAllImages = (car) => {
    if (Array.isArray(car.images) && car.images.length > 0) return car.images;
    if (car.imageUrl) return [car.imageUrl];
    return [PLACEHOLDER_CAR_IMAGE];
  };

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/cars`);
      if (!res.ok) throw new Error(`Failed to fetch cars: ${res.status}`);

      const data = await res.json();
      const docs = Array.isArray(data) ? data : data?.data || data?.documents || [];

      setCars(docs);
    } catch (err) {
      setError(err.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Multi-file selection with validation
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`Skipped ${file.name}: Not an image file`);
        return false;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError(`Skipped ${file.name}: File too large (max 8MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0 && files.length > 0) {
      return;
    }

    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setError("");
    }

    // clear input value so same file can be reselected later if needed
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ["brand", "model", "year", "price", "fuelType"];
    const missing = required.filter((field) => !formData[field]?.toString().trim());
    if (missing.length) throw new Error(`Missing required fields: ${missing.join(", ")}`);
    if (formData.year && (+formData.year < 1886 || +formData.year > 2030)) throw new Error("Year must be between 1886 and 2030");
    if (formData.price && (+formData.price < 0 || +formData.price > 1000000)) throw new Error("Price must be between 0 and 1,000,000");
  };

  // Upload multiple images to /upload-multiple
  const uploadMultiple = async (files) => {
    if (!files || files.length === 0) return [];
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token - please login again");

    const fd = new FormData();
    files.forEach((file) => fd.append("images", file));

    const res = await fetch(`${BACKEND_URL}/upload-multiple`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type
      body: fd,
    });

    let result;
    try {
      result = await res.json();
    } catch (e) {
      throw new Error(`Upload failed: server responded with status ${res.status}`);
    }

    if (!res.ok) {
      // show per-file errors when available
      if (result?.files && Array.isArray(result.files)) {
        const errs = result.files.filter((f) => f.success === false).map((f) => `${f.name}: ${f.error || "unknown"}`);
        throw new Error(`Upload failed (${res.status}): ${errs.join("; ")}`);
      }
      throw new Error(result?.error || `Upload failed with status ${res.status}`);
    }

    const uploadedUrls = Array.isArray(result.files) ? result.files.filter((f) => f.success && f.url).map((f) => f.url) : [];

    // fallback to per-file single upload if necessary
    if (uploadedUrls.length === 0) {
      const perFile = [];
      for (const file of files) {
        try {
          const singleFd = new FormData();
          singleFd.append("image", file);
          const r = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: singleFd,
          });
          const jr = await r.json().catch(() => ({}));
          if (r.ok && jr?.success && jr.imageUrl) perFile.push(jr.imageUrl);
        } catch (e) {
          console.error("single upload fallback error", e);
        }
      }
      if (perFile.length > 0) return perFile;
      throw new Error("No images were successfully uploaded. Check server logs and Appwrite permissions.");
    }

    // show warning for partial failures
    if (result.files) {
      const failed = result.files.filter((f) => f.success === false);
      if (failed.length) setError(`Warning: ${failed.length} file(s) failed to upload: ${failed.map((f) => f.name).join(", ")}`);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setUploading(true);

      validateForm();
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      let uploadedUrls = [];
      if (imageFiles.length > 0) uploadedUrls = await uploadMultiple(imageFiles);

      const allImages = [...uploadedUrls, ...formData.images];

      const payload = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year, 10),
        price: parseFloat(formData.price),
        fuelType: formData.fuelType,
        images: allImages,
        imageUrl: allImages[0] || PLACEHOLDER_CAR_IMAGE,
        mileage: formData.mileage ? parseInt(formData.mileage, 10) : 0,
        color: formData.color,
        transmission: formData.transmission,
        owners: formData.owners,
        type: formData.type,
        seatingCapacity: formData.seatingCapacity ? parseInt(formData.seatingCapacity, 10) : 5,
        location: formData.location,
        available: formData.available,
        features: typeof formData.features === "string" && formData.features.trim() ? formData.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      };

      const url = editingCar ? `${BACKEND_URL}/cars/${getCarId(editingCar)}` : `${BACKEND_URL}/cars`;
      const method = editingCar ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result?.success) throw new Error(result?.error || `Failed to ${editingCar ? "update" : "create"} car`);

      await fetchCars();
      setShowForm(false);
      resetForm();
      setEditingCar(null);
      setError(`✅ Car ${editingCar ? "updated" : "created"} successfully!`);
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      year: "",
      price: "",
      fuelType: "Gasoline",
      imageUrl: "",
      images: [],
      mileage: "",
      color: "White",
      transmission: "Manual",
      owners: "1st Owner",
      type: "Sedan",
      seatingCapacity: "5",
      location: "Main Branch",
      available: true,
      features: "",
    });

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year?.toString() || "",
      price: car.price?.toString() || "",
      fuelType: car.fuelType || "Gasoline",
      imageUrl: car.imageUrl || "",
      images: Array.isArray(car.images) ? car.images : [],
      mileage: car.mileage?.toString() || "",
      color: car.color || "White",
      transmission: car.transmission || "Manual",
      owners: car.owners || "1st Owner",
      type: car.type || "Sedan",
      seatingCapacity: car.seatingCapacity?.toString() || "5",
      location: car.location || "Main Branch",
      available: car.available !== undefined ? car.available : true,
      features: Array.isArray(car.features) ? car.features.join(", ") : (car.features || ""),
    });

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${BACKEND_URL}/cars/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result?.success) throw new Error(result?.error || "Delete failed");

      setCars((prev) => prev.filter((car) => getCarId(car) !== carId));
      setError("✅ Car deleted successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete car");
    }
  };

  const toggleAvailability = async (car) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${BACKEND_URL}/cars/${getCarId(car)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ available: !car.available }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result?.success) throw new Error(result?.error || "Update failed");

      setCars((prev) => prev.map((c) => (getCarId(c) === getCarId(car) ? { ...c, available: !car.available } : c)));
    } catch (err) {
      setError(err.message || "Failed to toggle availability");
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="text-lg font-medium text-muted-foreground">Loading cars...</div>
          {error && <div className="text-sm text-destructive mt-2">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your car inventory</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Customer View
            </button>
            <button onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Main Actions */}
        <div className="bg-card border rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">Car Inventory</h2>
                <p className="text-sm text-muted-foreground mt-1">{cars.length} car{cars.length !== 1 ? 's' : ''} in stock</p>
              </div>
              <button onClick={() => { setShowForm(true); setEditingCar(null); resetForm(); }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Add New Car
              </button>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-6 rounded-lg border p-4 ${error.includes("✅") ? "border-green-200 bg-green-50 text-green-800" : error.includes("❌") ? "border-red-200 bg-red-50 text-red-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-sm underline hover:no-underline">Dismiss</button>
            </div>
          </div>
        )}

        {/* Car Inventory Grid */}
        <div className="bg-card border rounded-lg shadow-sm">
          <div className="p-6">
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No cars found in the database.</div>
                <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Add Your First Car</button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cars.map((car) => {
                  const images = getAllImages(car);
                  const primaryImage = getPrimaryImage(car);
                  return (
                    <div key={getCarId(car)} className={`group relative border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-200 ${!car.available ? "opacity-60" : "hover:-translate-y-1"}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={primaryImage} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300 cursor-zoom-in" onClick={() => setLightbox({ open: true, images, index: 0 })} onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }} />
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${car.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{car.available ? "Available" : "Unavailable"}</span>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">{car.year}</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg leading-tight text-card-foreground">{car.brand} {car.model}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <span>₹{car.price?.toLocaleString()}</span>
                          <span>•</span>
                          <span>{car.fuelType}</span>
                          <span>•</span>
                          <span>{car.transmission}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1"><span>📍 {car.location}</span></div>
                          <div className="flex items-center gap-1"><span>👤 {car.owners}</span></div>
                        </div>

                        {images.length > 0 && (
                          <div className="mb-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {images.slice(0, 4).map((image, index) => (
                                <img key={index} src={image} alt={`${car.brand} ${car.model} - Image ${index + 1}`} className="w-10 h-10 object-cover rounded border cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity" onClick={() => setLightbox({ open: true, images, index })} onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }} />
                              ))}
                              {images.length > 4 && (<button className="text-xs text-primary underline self-center hover:no-underline" onClick={() => setLightbox({ open: true, images, index: 4 })}>+{images.length - 4}</button>)}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button onClick={() => toggleAvailability(car)} className={`inline-flex flex-1 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${car.available ? "text-yellow-600 border-yellow-200" : "text-green-600 border-green-200"}`}>{car.available ? "Make Unavailable" : "Make Available"}</button>
                          <button onClick={() => handleEdit(car)} className="inline-flex flex-1 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Edit</button>
                          <button onClick={() => handleDelete(getCarId(car))} className="inline-flex flex-1 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Car Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-card-foreground">{editingCar ? "Edit Car" : "Add New Car"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"><span className="sr-only">Close</span><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <InputField label="Brand *" name="brand" value={formData.brand} onChange={handleInputChange} required maxLength={64} />
                <InputField label="Model *" name="model" value={formData.model} onChange={handleInputChange} required maxLength={64} />
                <InputField label="Year *" name="year" type="number" value={formData.year} onChange={handleInputChange} required min={1886} max={2030} />
                <InputField label="Price *" name="price" type="number" value={formData.price} onChange={handleInputChange} required min={0} max={1000000} />
                <SelectField label="Fuel Type *" name="fuelType" value={formData.fuelType} onChange={handleInputChange} options={["Gasoline","Petrol","Diesel","Electric","Hybrid","CNG"]} required />
                <InputField label="Mileage (km)" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} min={0} max={1000000} />
                <InputField label="Color" name="color" value={formData.color} onChange={handleInputChange} maxLength={64} />
                <SelectField label="Transmission" name="transmission" value={formData.transmission} onChange={handleInputChange} options={["Manual","Automatic","AMT","CVT","DCT"]} />
                <SelectField label="Owners" name="owners" value={formData.owners} onChange={handleInputChange} options={["1st Owner","2nd Owner","3rd Owner","4th Owner+"]} />
                <SelectField label="Type" name="type" value={formData.type} onChange={handleInputChange} options={["Sedan","SUV","Hatchback","Coupe","Convertible","Minivan","Pickup"]} />
                <InputField label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleInputChange} min={1} max={20} />
                <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} maxLength={128} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">Features (comma-separated)</label>
                <textarea name="features" value={formData.features} onChange={handleInputChange} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" maxLength={512} placeholder="AC, Power Steering, Music System, Sunroof..." rows={3} />
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label className="text-sm font-medium text-card-foreground">Available for rent/sale</label>
              </div>

              {/* Multiple Images Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">Upload Images (max 10 files, 8MB each)</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="mb-2 text-sm text-muted-foreground">Click to upload images</p>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-card-foreground mb-2">New Images to Upload ({imagePreviews.length})</p>
                    <div className="flex gap-2 flex-wrap">{imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-destructive/90 transition-colors">×</button>
                      </div>
                    ))}</div>
                  </div>
                )}

                {formData.images?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-card-foreground mb-2">Existing Images ({formData.images.length})</p>
                    <div className="flex gap-2 flex-wrap">{formData.images.map((image, index) => (
                      <img key={index} src={image} alt={`Existing ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border" onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }} />
                    ))}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Cancel</button>
                <button type="submit" disabled={uploading} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>Uploading...</>) : editingCar ? "Update Car" : "Add Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox/Carousel */}
      {lightbox.open && <Lightbox images={lightbox.images} index={lightbox.index} onClose={() => setLightbox({ open: false, images: [], index: 0 })} />}
    </div>
  );
}

// Reusable Input Component
function InputField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">{label}</label>
      <input {...props} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
    </div>
  );
}

// Reusable Select Component
function SelectField({ label, name, value, onChange, options = [], required }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">{label}</label>
      <select name={name} value={value} onChange={onChange} required={required} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {options.map((option) => (<option key={option} value={option}>{option}</option>))}
      </select>
    </div>
  );
}

// Lightbox Component
function Lightbox({ images, index = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-card-foreground hover:text-muted-foreground transition-colors z-10"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      {images.length > 1 && (<><button onClick={prevImage} className="absolute left-4 text-card-foreground hover:text-muted-foreground transition-colors z-10"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      <button onClick={nextImage} className="absolute right-4 text-card-foreground hover:text-muted-foreground transition-colors z-10"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button></>)}

      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
        <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="max-w-full max-h-full object-contain rounded-lg" onError={(e) => { e.target.src = PLACEHOLDER_ERROR_IMAGE; }} />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-card-foreground text-sm bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">{currentIndex + 1} / {images.length}</div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2">
          {images.map((image, idx) => (<img key={idx} src={image} alt={`Thumbnail ${idx + 1}`} onClick={() => setCurrentIndex(idx)} className={`w-12 h-12 object-cover rounded border cursor-pointer flex-shrink-0 transition-all ${currentIndex === idx ? "ring-2 ring-primary ring-opacity-80" : "opacity-70 hover:opacity-100"}`} onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23fef2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23dc2626'%3EE%3C/text%3E%3C/svg%3E"; }} />))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
