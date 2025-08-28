import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CalendarIcon, 
  ClockIcon, 
  LocateFixed, 
  Star, 
  Trophy,
  Zap,
  Clock,
  Award,
  PartyPopper,
  Smartphone,
  ThumbsUp,
  Film,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import AOS from "aos";
import "aos/dist/aos.css";

import court1 from "@/assets/popular1.jpg";
import court2 from "@/assets/popular2.jpg";
import court3 from "@/assets/popular3.jpg";
import court4 from "@/assets/popular4.jpg";
import court5 from "@/assets/popular5.jpg";
import court6 from "@/assets/popular6.jpg";
import padelVideo from "@/assets/padel video.mp4";

const courtImages = [court1, court2, court3, court4, court5, court6];

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [filteredCourts, setFilteredCourts] = useState<number[] | null>(null);
  const [showMap, setShowMap] = useState(false);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : i;
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const formatDateTime = () => {
    if (!date || !time) return "Select Schedule";
    const [hours, minutes] = time.split(":");
    const d = new Date(date);
    d.setHours(parseInt(hours), parseInt(minutes));
    return format(d, "PPP p");
  };

  const handleNearClick = () => {
    const areaToCourtsMap: Record<string, number[]> = {
      "DHA Phase 6": [3, 4],
      "F-11": [2, 6],
    };
    const courts = areaToCourtsMap[area] || [];
    setFilteredCourts(courts);
    console.log("Filtering by: Near Me");
  };

  const handleLowToHighFilter = () => {
    // Add your actual logic for "Low to High" filtering here
    console.log("Filtering by: Low to High");
    // Example: setFilteredCourts( /* logic to sort courts by price low to high */ );
  };

  const handlePremiumCourtsFilter = () => {
    // Add your actual logic for "Premium Courts" filtering here
    console.log("Filtering by: Premium Courts");
    // Example: setFilteredCourts( /* logic to filter for premium courts */ );
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
      "Premium surface and lights",
      "Perfect for doubles",
      "Central, clean, and accessible",
      "Luxury experience guaranteed",
      "Best for tournaments",
      "Beginner-friendly and affordable",
    ];
    const prices = [1200, 1000, 900, 1500, 1300, 800];
    const ratings = [4.5, 4.2, 4.0, 4.8, 4.6, 3.9];

    return (
      <div key={index} className="bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-[#adef0e]">
        <div className="relative">
          <img 
            src={courtImages[index - 1]} 
            alt={names[index - 1]} 
            className="w-full h-52 object-cover rounded-t-lg" 
          />
          <div className="absolute top-2 right-2 bg-[#FFD700] rounded-full p-2 shadow-lg">
            <Trophy className="h-5 w-5 text-[#0F172A]" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{names[index - 1]}</h3>
            <span className="text-sm bg-[#adef0e]/20 text-[#adef0e] px-2 py-0.5 rounded">Rs. {prices[index - 1]}</span>
          </div>
          <p className="text-sm text-[#94A3B8]">{descriptions[index - 1]}</p>
          <div className="flex items-center text-[#FFD700]">
            {[...Array(Math.floor(ratings[index - 1]))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FFD700] stroke-[#FFD700]" />
            ))}
            {ratings[index - 1] % 1 !== 0 && (
              <Star className="h-4 w-4 fill-[#FFD700]/50 stroke-[#FFD700]" />
            )}
            <span className="text-sm text-[#94A3B8] ml-2">({ratings[index - 1]})</span>
          </div>
          <Button
            onClick={() => navigate("/booking")}
            className="w-full bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
          >
            <Trophy className="inline mr-2 h-4 w-4" /> Book Now
          </Button>
        </div>
      </div>
    );
  };

  const courtCards = () => {
    if (filteredCourts === null) {
      return [...Array(6)].map((_, index) => renderCourt(index + 1));
    } else if (filteredCourts.length === 0) {
      return (
        <div className="col-span-full text-center text-red-400 font-medium">
          No courts found near your selected area
        </div>
      );
    } else {
      return filteredCourts.map((courtNum) => renderCourt(courtNum));
    }
  };

  return (
    <div className="bg-[#0F172A] text-[#E2E8F0]">
      {/* HERO */}
      <div className="relative h-[100vh] w-full -mt-20 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={padelVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#020617]/20 flex items-center z-10 -mt-30">
          <div className="pl-[10%] space-y-6" data-aos="fade-right" data-aos-delay="200">
            <h1 className="text-5xl font-extrabold text-[#94A3B8] text-left leading-tight">
              Find Your <br /> Perfect Padel Court
            </h1>
            <button
              onClick={() => navigate("/booking")}
              className="w-full sm:w-auto bg-[#adef0e] border-1 text-[#020617] hover:bg-[#cfff2e]  hover:text-[#020617] transition-all font-medium px-6 py-3 rounded-md text-lg"
            >
              Book Court
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      {/* SEARCH */}
      <div className="lg:-mt-40 z-30 relative flex justify-center">
          {/* Reduced padding from py-4 to py-3 */}
          <div className="w-[80%] md:w-[80%] bg-[#0F172A]/50 px-4 md:px-8 py-3 rounded-xl border border-[#334155] -ml-2">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Area Input Width Reduced */}
              <div className="flex items-center gap-2 w-full md:w-1/4 bg-[#0F172A] p-3 rounded-xl shadow border border-[#334155] hover:border-[#adef0e] transition-all">
                <LocateFixed className="w-7 h-5 text-[#adef0e]" />
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area name"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-[#64748B]"
                />
              </div>

              <Popover>
                {/* Date Popover Trigger Width Reduced */}
                <PopoverTrigger className="flex items-center gap-2 w-full md:w-1/5 bg-[#0F172A] p-3 rounded-xl shadow border border-[#334155] text-sm text-white hover:border-[#adef0e] transition-all">
                  <CalendarIcon className="w-4 h-4 text-[#adef0e]" />
                  {date ? format(date, "PPP") : "Select date"}
                </PopoverTrigger>
                <PopoverContent className="bg-[#0F172A] border border-[#334155] shadow-lg p-3 rounded-md z-50">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="bg-[#0F172A] text-white"
                  />
                </PopoverContent>
              </Popover>

              {/* Time Select Width Reduced */}
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full md:w-[15%] text-sm px-3 py-2 rounded-xl bg-[#0F172A] text-white border border-[#334155] shadow hover:border-[#adef0e] transition-all"
              >
                <option value="" className="bg-[#0F172A]">
                  Select time
                </option>
                {times.map((t) => (
                  <option key={t} value={t} className="bg-[#0F172A]">
                    {t}
                  </option>
                ))}
              </select>

              {/* New wrapper div for Search and Filter buttons */}
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                

                {/* Filter Courts DropdownMenu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto border-1 hover:bg-[#adef0e] hover:text-black transition-all"
                    >
                      Filter Courts <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0F172A] border border-[#334155] text-white">
                    <DropdownMenuItem
                      onClick={handleNearClick}
                      className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                    >
                      Near Me
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLowToHighFilter}
                      className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                    >
                      Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handlePremiumCourtsFilter}
                      className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                    >
                      Premium Courts
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (date && time && area) {
                      handleNearClick();
                    }
                  }}
                  className="w-full md:w-auto border-1  hover:bg-[#adef0e] hover:text-black transition-all"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
      </div>
      {/* ABOUT */}
      <section className="mt-30 w-full flex flex-col md:flex-row h-auto" data-aos="fade-up">
        <div
          className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${court2})` }}
        ></div>
        <div className="w-full md:w-1/2 bg-[#0F172A] flex items-center px-6 py-12 text-left">
          <div className="max-w-xl space-y-6">
            <p className="text-[#adef0e] uppercase tracking-widest font-medium">
              Welcome
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              ABOUT <br /> PADELBOOKING
            </h2>
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Your gateway to discovering and booking padel courts anywhere in Pakistan.
              We're here to make your game-time hassle-free and unforgettable.
            </p>
            <Button 
              onClick={() => navigate("/about")}
              className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
            >
              About Us
            </Button>
          </div>
        </div>
      </section>

      {/* DYNAMIC PLAY */}
      <section className="w-full bg-[#0F172A] py-20 mt-20 relative overflow-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative">
          <div className="hidden md:block w-[40%]" />
          <div
            className="w-full md:w-[70%] h-80 md:h-[400px] bg-cover bg-center relative z-0"
            style={{ backgroundImage: `url(${court6})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-[#020617]/70 to-transparent" />
          </div>
          <div className="absolute top-1/2 right-[45%] transform -translate-y-1/2 z-10 w-[50%] max-w-xl bg-[#1E293B]/90 backdrop-blur-md px-6 md:px-8 py-6 rounded-md shadow-lg text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight">
              Dynamic Play<br />Padel Unveiled
            </h2>
            <p className="mt-4 text-[#94A3B8] text-lg leading-relaxed">
              Step into the vibrant energy of padel with our latest brand film.  
              From the fast-paced rallies to the cheering crowds,  
              this visual journey captures the spirit of the game like never before.  
              Experience the thrill, the finesse, and the passion that drives padel players across the nation.
            </p>
            <Button 
              onClick={() => navigate("/about")}
              className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
            >
              <Film className="mr-2 h-4 w-4" /> Watch Now
            </Button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-[#0F172A]" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-white uppercase tracking-wide mb-4">
            Why Choose PadelBooking?
          </h2>
          <p className="text-center text-[#94A3B8] text-lg mb-12 max-w-2xl mx-auto">
            We go beyond just booking. PadelBooking delivers convenience, quality, and an unforgettable padel experience for players of all levels.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Flexible Timings",
                desc: "Play when it suits you – early mornings, late nights, or anytime in between.",
                icon: <Clock className="h-8 w-8 text-[#adef0e]" />,
              },
              {
                title: "Premium Courts",
                desc: "All courts meet international standards for turf, lighting, and overall design.",
                icon: <Award className="h-8 w-8 text-[#adef0e]" />,
              },
              {
                title: "Quick Bookings",
                desc: "Instant booking system with live availability and no waiting.",
                icon: <Zap className="h-8 w-8 text-[#adef0e]" />,
              },
              {
                title: "Great Atmosphere",
                desc: "Clean, well-maintained venues with an energetic and welcoming vibe.",
                icon: <PartyPopper className="h-8 w-8 text-[#adef0e]" />,
              },
              {
                title: "Seamless Experience",
                desc: "From search to play – the smoothest way to get on court in seconds.",
                icon: <Smartphone className="h-8 w-8 text-[#adef0e]" />,
              },
              {
                title: "Trusted by Players",
                desc: "Loved and recommended by padel communities across Pakistan.",
                icon: <ThumbsUp className="h-8 w-8 text-[#adef0e]" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1E293B] p-6 rounded-lg shadow hover:shadow-md hover:border-[#adef0e] border border-[#334155] transition text-left"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#0F172A]" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-white tracking-wide mb-4">
            TESTIMONIALS & REVIEWS
          </h2>
          <p className="text-center text-[#94A3B8] text-lg mb-12">
            Hear from real players—why they love booking padel courts with us.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "PadelBooking's hassle‑free booking made my weekend practice sessions seamless!",
                name: "Ali Khan",
                role: "Lahore Player",
              },
              {
                text: "Court availability is always up-to-date and booking is fast. Love it!",
                name: "Sara Ahmed",
                role: "Islamabad Enthusiast",
              },
              {
                text: "The intuitive interface and location options are a total game-changer.",
                name: "Bilal Raza",
                role: "Karachi Coach",
              },
            ].map((t, i) => (
              <div key={i} className="bg-[#1E293B] rounded-lg p-8 shadow-lg border border-[#334155] hover:border-[#adef0e] text-center transition-all">
                <div className="mx-auto w-16 h-16 rounded-full mb-4 border-2 border-[#adef0e] flex items-center justify-center bg-[#0F172A]">
                  <ThumbsUp className="h-6 w-6 text-[#adef0e]" />
                </div>
                <p className="italic text-[#E2E8F0] mb-6">"{t.text}"</p>
                <div className="font-semibold text-[#adef0e]">{t.name}</div>
                <div className="text-sm text-[#94A3B8]">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READY TO PLAY SECTION */}
      <section className="relative h-[60vh] w-full flex items-center justify-center" data-aos="fade-up">
        <div
          className="w-[90%] h-full bg-cover bg-center rounded-xl shadow-md relative"
          style={{ backgroundImage: `url(${court1})` }}
        >
          <div className="absolute inset-0 bg-[#020617]/50 rounded-xl" />
          <div className="absolute inset-0 flex items-center px-12">
            <div className="max-w-2xl space-y-6 z-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
                READY TO PLAY?
              </h2>
              <h3 className="text-3xl sm:text-4xl italic font-extrabold text-[#adef0e] leading-tight">
                BOOK YOUR.<br />COURTS NOW.
              </h3>
              <Button
                onClick={() => navigate("/courts")}
                className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
              >
                <ChevronRight className="mr-2 h-5 w-5" /> Play Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* COURTS */}
      <section className="py-12 bg-[#0F172A]">
        <h2 className="text-3xl font-semibold mb-8 text-center text-[#adef0e]">Popular Courts</h2>
        <div className="mx-auto w-[90%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courtCards()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;