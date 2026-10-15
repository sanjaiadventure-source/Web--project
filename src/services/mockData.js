// Authentic luxury hotels and resorts data with comprehensive room types and amenities
export const INITIAL_HOTELS = [
  {
    id: "hotel-1",
    name: "The Ritz-Carlton Grand Palace",
    tagline: "Five-Star Luxury Overlooking the Seine & Eiffel Tower",
    location: "Paris, France",
    city: "Paris",
    country: "France",
    rating: 4.9,
    reviewCount: 428,
    basePrice: 520,
    featuredImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Free High-Speed Wi-Fi", "Michelin Star Dining", "Heated Infinity Pool", "Luxury Spa & Sauna", "24/7 Concierge", "Valet Parking", "Fitness Center"],
    availableRooms: 5,
    description: "Experience unparalleled French elegance in the heart of Paris. The Ritz-Carlton Grand Palace blends neoclassical architecture with contemporary haute luxury, panoramic terrace views of the Eiffel Tower, and bespoke white-glove service.",
    address: "15 Place Vendôme, 75001 Paris",
    rooms: [
      {
        id: "room-101",
        name: "Deluxe Eiffel View Suite",
        type: "Deluxe Suite",
        pricePerNight: 520,
        maxGuests: 2,
        bedType: "King Bed",
        sizeSqFt: 620,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        features: ["Direct Eiffel Tower View", "Marble Bathroom with Soaking Tub", "Complimentary Champagne", "Nespresso Bar", "Soundproof Windows"],
        availableCount: 3
      },
      {
        id: "room-102",
        name: "Imperial Royal Penthouse",
        type: "Penthouse Suite",
        pricePerNight: 980,
        maxGuests: 4,
        bedType: "2 California King Beds",
        sizeSqFt: 1450,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        features: ["Private Rooftop Terrace", "Personal Butler Service", "Private Jacuzzi", "Walk-in Dressing Room", "Private Dining Room"],
        availableCount: 2
      }
    ]
  },
  {
    id: "hotel-2",
    name: "Amanpuri Azure Atoll Resort",
    tagline: "Ultra-Private Overwater Ocean Villas with Coral Reef Access",
    location: "Maldives",
    city: "Baa Atoll",
    country: "Maldives",
    rating: 5.0,
    reviewCount: 312,
    basePrice: 850,
    featuredImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Overwater Bungalows", "Private Plunge Pool", "PADI Dive Center", "Ayurvedic Wellness Spa", "Seaplane Transfer", "Sunset Catamaran Cruise"],
    availableRooms: 3,
    description: "Nestled in a pristine UNESCO Biosphere Reserve, Amanpuri Azure Atoll offers secluded sanctuary over crystal turquoise waters with glass-bottom floors, private plunge pools, and world-class reef snorkeling.",
    address: "Baa Atoll Biosphere Reserve, Republic of Maldives",
    rooms: [
      {
        id: "room-201",
        name: "Sunset Overwater Villa",
        type: "Ocean Villa",
        pricePerNight: 850,
        maxGuests: 2,
        bedType: "King Bed",
        sizeSqFt: 980,
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        features: ["Glass Floor Marine View", "Private Sun Deck & Lagoon Hammock", "Infinity Plunge Pool", "Outdoor Rainfall Shower"],
        availableCount: 2
      },
      {
        id: "room-202",
        name: "Grand Ocean Residence",
        type: "Presidential Villa",
        pricePerNight: 1600,
        maxGuests: 6,
        bedType: "3 King Beds",
        sizeSqFt: 2400,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        features: ["Private Chef & Butler", "360-Degree Ocean Panorama", "Direct Reef Snorkel Stairs", "Private Wine Cellar"],
        availableCount: 1
      }
    ]
  },
  {
    id: "hotel-3",
    name: "The Manhattan Sky Highline",
    tagline: "Architectural Landmark in Manhattan Hudson Yards",
    location: "New York, USA",
    city: "New York",
    country: "USA",
    rating: 4.8,
    reviewCount: 890,
    basePrice: 420,
    featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Panoramic Skyline Views", "Rooftop Cocktail Lounge", "Equinox Fitness Club", "Fast EV Charging", "Pet Friendly", "Business Center"],
    availableRooms: 8,
    description: "Rising 60 stories above Hudson Yards and the High Line park, The Manhattan Sky Highline sets the standard for contemporary urban luxury with floor-to-ceiling glass, curated modern art, and iconic skyline vistas.",
    address: "500 West 33rd Street, New York, NY 10001",
    rooms: [
      {
        id: "room-301",
        name: "Skyline Corner King",
        type: "Executive Room",
        pricePerNight: 420,
        maxGuests: 2,
        bedType: "King Bed",
        sizeSqFt: 480,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        features: ["Dual-Aspect Skyline Views", "Motorized Blackout Blinds", "Smart Ambient Lighting", "Aromatherapy Shower"],
        availableCount: 5
      },
      {
        id: "room-302",
        name: "Hudson Riverfront Suite",
        type: "Luxury Suite",
        pricePerNight: 690,
        maxGuests: 3,
        bedType: "King Bed + Queen Sofa Bed",
        sizeSqFt: 850,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        features: ["Sunset River Views", "Separate Executive Lounge", "Barista Coffee Station", "Sub-Zero Bar Cabinet"],
        availableCount: 3
      }
    ]
  },
  {
    id: "hotel-4",
    name: "Hoshinoya Kyoto Traditional Sanctuary",
    tagline: "Serene Riverside Ryokan Reached by Traditional Wooden Boat",
    location: "Kyoto, Japan",
    city: "Kyoto",
    country: "Japan",
    rating: 4.95,
    reviewCount: 345,
    basePrice: 620,
    featuredImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Traditional Japanese Onsen", "Kaiseki Multi-course Dining", "Private Zen Gardens", "Tea Ceremony Pavilion", "River Boat Shuttle", "Yukata Kimono Robes"],
    availableRooms: 4,
    description: "A tranquil riverside retreat in Arashiyama, Kyoto. Accessible only by a scenic riverboat cruise, guests indulge in century-old cedar timber craftsmanship, soothing hot spring baths, and seasonal kaiseki masterpieces.",
    address: "11-2 Arashiyama Genrokuzan-cho, Nishikyo-ku, Kyoto",
    rooms: [
      {
        id: "room-401",
        name: "Tsukihashi Maple Pavilion",
        type: "Traditional Tatami Suite",
        pricePerNight: 620,
        maxGuests: 2,
        bedType: "Custom Ryokan Futons / Low King",
        sizeSqFt: 650,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        features: ["Private Hinoki Wood Soaking Tub", "Handcrafted Karakami Wallpaper", "Riverside Maple Garden Balcony", "Morning Zen Meditation Guide"],
        availableCount: 2
      },
      {
        id: "room-402",
        name: "Yamanoha Panoramic Pavilion",
        type: "Grand Japanese Villa",
        pricePerNight: 890,
        maxGuests: 4,
        bedType: "2 Low King Beds",
        sizeSqFt: 1100,
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        features: ["Private Geothermal Hot Spring", "Sweeping Valley & Waterfall Views", "Private Tea Master Experience", "Tatami Living Room"],
        availableCount: 2
      }
    ]
  },
  {
    id: "hotel-5",
    name: "Burj Al-Sultana Palace",
    tagline: "Iconic Arabian Oasis with Private Helipad & Gold Finishes",
    location: "Dubai, UAE",
    city: "Dubai",
    country: "UAE",
    rating: 4.88,
    reviewCount: 615,
    basePrice: 720,
    featuredImage: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Private White Sand Beach", "Chauffeured Rolls-Royce Fleet", "9 Signature Restaurants", "Submarine Aquarium Dining", "Gold Leaf Hammam", "Infinity Sky Pool"],
    availableRooms: 6,
    description: "Rising majestically on its own private island along Jumeirah Beach, Burj Al-Sultana is an undisputed icon of opulent Arabian hospitality, featuring 24-karat gold interiors, duplex suites, and dedicated floor butlers.",
    address: "Jumeirah Beach Road, Dubai, United Arab Emirates",
    rooms: [
      {
        id: "room-501",
        name: "Deluxe Duplex Marina Suite",
        type: "Duplex Suite",
        pricePerNight: 720,
        maxGuests: 2,
        bedType: "King Bed",
        sizeSqFt: 880,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        features: ["Two-Story Spiral Gold Staircase", "Hermès Bath Amenities", "Floor-to-Ceiling Arabian Gulf Panorama", "Interactive Cinema Screen"],
        availableCount: 4
      },
      {
        id: "room-502",
        name: "Presidential Royal Suite",
        type: "Presidential Suite",
        pricePerNight: 1450,
        maxGuests: 4,
        bedType: "2 Rotatable Canopied King Beds",
        sizeSqFt: 1850,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        features: ["Private Gold Elevator", "Private Cinema Room", "Marble Jacuzzi with City Views", "24/7 Dedicated Chauffeur"],
        availableCount: 2
      }
    ]
  },
  {
    id: "hotel-6",
    name: "Matterhorn Alpine Glacier Lodge",
    tagline: "Ski-in/Ski-out Chalet with Thermal Springs & Mountain Views",
    location: "Zermatt, Switzerland",
    city: "Zermatt",
    country: "Switzerland",
    rating: 4.92,
    reviewCount: 298,
    basePrice: 590,
    featuredImage: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Direct Ski-in / Ski-out", "Outdoor Heated Thermal Pool", "Swiss Fondue & Wine Cellar", "Wood-burning Fireplace", "Ski Equipment Butler", "Helicopter Ski Tours"],
    availableRooms: 4,
    description: "Perched high in the Swiss Alps facing the legendary Matterhorn peak, this timber-and-granite luxury lodge offers ski-in ski-out convenience, crackling fireplaces, and steaming outdoor mineral pools surrounded by snow.",
    address: "Riffelalp 2222m, Zermatt 3920, Switzerland",
    rooms: [
      {
        id: "room-601",
        name: "Glacier Alpine Suite",
        type: "Mountain Suite",
        pricePerNight: 590,
        maxGuests: 2,
        bedType: "Swiss Pine King Bed",
        sizeSqFt: 600,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        features: ["Matterhorn Peak Direct Balcony", "Stone Fireplace", "Heated Oak Flooring", "Glacier Water Bar"],
        availableCount: 3
      },
      {
        id: "room-602",
        name: "Chalet Summit Penthouse",
        type: "Chalet Suite",
        pricePerNight: 1100,
        maxGuests: 5,
        bedType: "2 King Beds + 1 Daybed",
        sizeSqFt: 1500,
        image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
        features: ["Private Sauna & Hot Tub on Terrace", "Full Gourmet Kitchen with Sommelier", "Private Ski Locker & Dryer", "Stargazing Telescope"],
        availableCount: 1
      }
    ]
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: "res-901",
    bookingCode: "LX-78241",
    hotelId: "hotel-1",
    hotelName: "The Ritz-Carlton Grand Palace",
    hotelLocation: "Paris, France",
    hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    roomId: "room-101",
    roomName: "Deluxe Eiffel View Suite",
    checkInDate: "2026-11-10",
    checkOutDate: "2026-11-14",
    nights: 4,
    guests: { adults: 2, children: 0, roomsCount: 1 },
    guestName: "Praveen Kumar",
    guestEmail: "praveen@luxehaven.com",
    guestPhone: "+91 98765 43210",
    specialRequests: "High floor facing the Eiffel Tower, late check-in at 8 PM.",
    pricing: {
      ratePerNight: 520,
      roomCost: 2080,
      taxes: 249.6,
      serviceFee: 45,
      discount: 0,
      totalAmount: 2374.6
    },
    status: "CONFIRMED", // CONFIRMED, MODIFIED, CANCELED
    createdAt: "2026-10-10T10:30:00Z"
  },
  {
    id: "res-902",
    bookingCode: "LX-93410",
    hotelId: "hotel-4",
    hotelName: "Hoshinoya Kyoto Traditional Sanctuary",
    hotelLocation: "Kyoto, Japan",
    hotelImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    roomId: "room-401",
    roomName: "Tsukihashi Maple Pavilion",
    checkInDate: "2026-12-05",
    checkOutDate: "2026-12-08",
    nights: 3,
    guests: { adults: 2, children: 0, roomsCount: 1 },
    guestName: "Praveen Kumar",
    guestEmail: "praveen@luxehaven.com",
    guestPhone: "+91 98765 43210",
    specialRequests: "Vegetarian kaiseki dinner preference.",
    pricing: {
      ratePerNight: 620,
      roomCost: 1860,
      taxes: 223.2,
      serviceFee: 45,
      discount: 100,
      totalAmount: 2028.2
    },
    status: "CONFIRMED",
    createdAt: "2026-10-12T14:15:00Z"
  }
];

export const DEMO_USERS = [
  {
    id: "user-101",
    name: "Praveen Kumar",
    email: "praveen@luxehaven.com",
    role: "VIP Platinum Guest",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    token: "mock-jwt-praveen-vip-token-valid-2026"
  },
  {
    id: "user-102",
    name: "Sarah Jenkins",
    email: "sarah@wanderlust.io",
    role: "Standard Member",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    token: "mock-jwt-sarah-member-token-valid-2026"
  }
];
