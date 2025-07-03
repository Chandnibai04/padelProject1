import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, ClockIcon, LocateFixed, Star } from "lucide-react";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import court images
import court1 from "@/assets/popular 1.jpg";
import court2 from "@/assets/popular 2.jpg";
import court3 from "@/assets/popular 3.jpg";
import court4 from "@/assets/popular 4.jpg";
import court5 from "@/assets/popular 5.jpg";
import court6 from "@/assets/popular 6.jpg";

const courtImages = [court1, court2, court3, court4, court5, court6];

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position === null ? null : <Marker position={position} icon={customIcon} />;
};

const MapPicker = ({ onSelect }) => (
  <div className="h-[400px] w-full">
    <MapContainer
      center={[24.8607, 67.0011]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full z-50"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  </div>
);

const Home = () => {
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [filteredCourts, setFilteredCourts] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const formatDateTime = () => {
    if (!date || !time) return "Select Schedule";
    const [hours, minutes] = time.split(":");
    const d = new Date(date);
    d.setHours(+hours, +minutes);
    return format(d, "PPP p");
  };

  const handleNearClick = () => {
    const areaToCourtsMap = {
      "DHA Phase 6": [3, 4],
      "F-11": [2, 6],
    };
    const courts = areaToCourtsMap[area];
    setFilteredCourts(courts || []);
  };

  const courtCards = () => {
    if (filteredCourts === null) {
      return [...Array(6)].map((_, index) => renderCourt(index + 1));
    } else if (filteredCourts.length === 0) {
      return (
        <div className="col-span-full text-center text-red-500 font-medium">
          ❌ No courts found near your selected area.
        </div>
      );
    } else {
      return filteredCourts.map((courtNum) => renderCourt(courtNum));
    }
  };

  const renderCourt = (index: number) => {
    const names = [
      "Padel Pro Court",
      "Elite Smash Zone",
      "Urban Racket Arena",
      "Grand Ace Club",
      "PowerServe Pavilion",
      "SmashPoint Hub",
    ];
    const descriptions = [
      "Professional court with premium surface.",
      "Best for group matches and night play.",
      "Central location with lighting system.",
      "Spacious court with lounge access.",
      "High-quality turf, best for tournaments.",
      "Affordable and beginner-friendly.",
    ];
    const prices = [1200, 1000, 900, 1500, 1300, 800];
    const ratings = [4.5, 4.2, 4.0, 4.8, 4.6, 3.9];

    return (
      <div
        key={index}
        className="relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg overflow-hidden"
      >
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
          🏆 Popular
        </div>

        <img
          src={courtImages[index - 1]}
          alt={names[index - 1]}
          className="h-60 w-full object-cover"
        />

        <div className="p-4 space-y-2">
          <div className="text-lg font-semibold text-blue-800 flex justify-between items-center">
            {names[index - 1]}
            <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
              Rs. {prices[index - 1]}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{descriptions[index - 1]}</p>

          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {[...Array(Math.floor(ratings[index - 1]))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
            ))}
            {ratings[index - 1] % 1 !== 0 && (
              <Star className="h-4 w-4 fill-yellow-300 stroke-yellow-500" />
            )}
            <span className="text-gray-600 ml-2">({ratings[index - 1]})</span>
          </div>

          <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
            Book Now
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-900">
      <div className="relative h-[60vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://profit.pakistantoday.com.pk/wp-content/uploads/2024/02/final-padel-1392x1044.jpg')",
          }}
        ></div>
        <div className="relative z-10">
          <Marquee className="bg-blue-600 text-white font-semibold py-2" speed={60} gradient={false}>
            🚀 Welcome to PadelBooking! 🎾 Book top-rated padel courts now! 💥 Fast · Easy · Fun ✨
          </Marquee>
        </div>
        <div className="absolute inset-0 bg-[#111827]/50 flex items-center justify-center text-white px-6 z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-yellow-400">
            Find Your Perfect Padel Court
          </h1>
        </div>
      </div>

      <div className="-mt-28 z-30 relative flex justify-center">
        <div className="w-[90%] sm:w-[70%] p-6 rounded-lg shadow-2xl bg-white/60 backdrop-blur-lg border border-gray-200">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Area Name"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              list="areas"
            />
            <Button onClick={() => setShowMap(true)} variant="outline" title="Use My Location">
              <LocateFixed className="h-5 w-5" />
            </Button>
          </div>
          <datalist id="areas">
            <option value="DHA Phase 6" />
            <option value="Gulshan-e-Iqbal" />
            <option value="Bahria Town" />
            <option value="F-11" />
          </datalist>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date && time ? <span>{formatDateTime()}</span> : <span>Select Schedule</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 space-y-4">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap justify-around gap-4">
            <Button onClick={handleNearClick} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              Near
            </Button>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Low to High</Button>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Premium Courts</Button>
          </div>
        </div>
      </div>

      <section className="py-12 bg-[#f8fafc]">
        <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">Popular Courts</h2>
        <div className="mx-auto w-[90%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courtCards()}
          </div>
        </div>
      </section>

      {showMap && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-[90%] sm:w-[600px]">
            <h2 className="text-xl font-semibold mb-4">Select Your Location</h2>
            <MapPicker
              onSelect={(lat, lng) => {
                const coordinatesToArea = [
                  {
                    name: "DHA Phase 6",
                    latRange: [24.85, 24.86],
                    lngRange: [67.01, 67.03],
                  },
                  {
                    name: "F-11",
                    latRange: [33.68, 33.70],
                    lngRange: [73.00, 73.02],
                  },
                ];
                const matched = coordinatesToArea.find(
                  (area) =>
                    lat >= area.latRange[0] &&
                    lat <= area.latRange[1] &&
                    lng >= area.lngRange[0] &&
                    lng <= area.lngRange[1]
                );

                if (matched) {
                  setArea(matched.name);
                } else {
                  setArea("Unknown Area");
                }
                setShowMap(false);
              }}
            />
            <div className="text-right mt-3">
              <Button onClick={() => setShowMap(false)} variant="ghost">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
