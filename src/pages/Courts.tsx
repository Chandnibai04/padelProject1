import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

import court1 from "@/assets/blog 1.jpg";
import court2 from "@/assets/blog 2.jpg";
import court3 from "@/assets/blog 3.jpg";
import court4 from "@/assets/blog 4.jpg";
import court5 from "@/assets/blog 5.jpg";
import court6 from "@/assets/blog 6.jpg";

export const courts = [
  {
    name: "Skyline Padel Arena",
    detail:
      "Skyline Padel Arena offers a luxurious rooftop playing experience with breathtaking views. Featuring international-grade turf, professional lighting, and post-game relaxation zones, it’s the perfect court for players who love atmosphere and excellence. Trainers and gear rentals are also available for beginners and pros alike.",
    price: "Rs 1500",
    image: court1,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Elite Padel Court",
    detail:
      "Nestled in a premium locality, Elite Padel Court features indoor temperature-controlled playing conditions with advanced shock-absorbent surfaces. It’s ideal for pro-level tournaments, coaching, or private matches. On-site amenities include a lounge, locker rooms, showers, and refreshment bars.",
    price: "Rs 2500",
    image: court2,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    name: "Padel Paradise",
    detail:
      "Padel Paradise is a family-friendly court designed for recreational games, kids’ training, and social padel gatherings. With a cozy environment, soft lighting, and weekend community events, this is the go-to place for casual players and those looking to learn the game.",
    price: "Rs 800",
    image: court3,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Grand Arena",
    detail:
      "The Grand Arena is a high-capacity padel court known for hosting weekend tournaments and team events. It features multiple adjacent courts, floodlights, audience seating, and a large parking space. Perfect for sports clubs, school competitions, and corporate bookings.",
    price: "1000",
    image: court4,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    name: "Ocean View Court",
    detail:
      "Play padel by the sea at Ocean View Court. The court sits near the shoreline, offering stunning sunsets and a peaceful playing experience. Its elevated glass fencing and panoramic design make it one of the most aesthetic courts in town. Best for romantic evening matches or photo shoots.",
    price: "Rs 1200",
    image: court5,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "City Sports Hub",
    detail:
      "Located in the city center, this court is known for its affordable rates, easy access, and non-stop padel action. It stays open till midnight and is ideal for spontaneous games, group matches, and quick workouts. A local favorite for students and office-goers alike.",
    price: "$22/hour",
    image: court6,
    video: "https://www.w3schools.com/html/movie.mp4",
  },
];

export default function Courts() {
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
<section className="min-h-screen bg-[#0F172A] pt-28 pb-16 px-4 sm:px-12 text-[#adef0e] -mt-20">
      <h1
        className="text-4xl sm:text-5xl font-extrabold text-center mb-20"
        data-aos="zoom-in"
      >
         Discover Our Padel Courts 
      </h1>

      <div className="space-y-24">
        {courts.map((court, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            } items-center gap-10`}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
          >
            {/* Image */}
            <div className="lg:w-1/2 w-full">
              <img
                src={court.image}
                alt={court.name}
                className="rounded-3xl w-full h-[320px] object-cover transform hover:scale-105 transition duration-300"
              />
            </div>

            {/* Info */}
            <div className="lg:w-1/2 w-full space-y-5 text-[#ffffff]">
              <h2 className="text-3xl font-bold ">
                {court.name}
              </h2>
              <p className="text-base leading-relaxed text-[#94A3B8]">
                {court.detail}
              </p>
              <p className="text-xl font-semibold text-[#adef0e]">
                {court.price}
              </p>

              <div className="flex gap-4 flex-wrap mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#adef0e] text-black font-semibold hover:bg-[#cfff2e] transition-all78"
                      onClick={() => setVideoUrl(court.video)}
                    >
                       Watch Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl w-full bg-black">
                    <video
                      controls
                      autoPlay
                      className="w-full rounded-lg"
                      src={videoUrl}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => navigate("/booking")}
                  className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-black transition-all"
                >
                   Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


