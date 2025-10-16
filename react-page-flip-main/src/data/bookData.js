// Edit this file to change all flipbook pages.
// For images, you can:
// - Use a full URL (https://...)
// - Or place files in `public/flipbook-images/` and set image: "/flipbook-images/your-image.png"
// Vite serves `public` at the web root.

// Cover background options:
// - Use a gradient/string in `coverBackground`
// - Or put an image in src/assets and set `coverBackgroundSrc` to the filename
export const coverBackground = "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"; // e.g., gradient
export const coverBackgroundSrc = "frontpage.png"; // e.g., an image in src/assets (set to null to use gradient)

const pages = [
  {
    id: "001",
    name: "Phulo ka safar",
    types: ["Khuub", "Phuul"],
    description:
      "Embark on an incredible journey through the world of Pokémon. Discover new friends and face exciting challenges.",
    image: "/1.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(255,107,107,0.8) 0%, rgba(238,90,36,0.8) 100%)",
  },
  {
    id: "002", 
    name: "Pokémon Adventure 2",
    types: ["Battle", "Friendship"],
    description:
      "Join trainers as they battle through gyms and form unbreakable bonds with their Pokémon companions.",
    image: "/2.jpg",
    backgroundSrc: "coverBG2.jpeg",
    background: "linear-gradient(145deg, rgba(72,52,212,0.7) 0%, rgba(104,109,224,0.7) 100%)",
  },
  {
    id: "003",
    name: "Pokémon Adventure 3", 
    types: ["Exploration", "Discovery"],
    description:
      "Venture into uncharted territories where legendary Pokémon await. Every step brings new discoveries.",
    image: "/3.jpg",
    backgroundSrc: "coverBG3.png",
    background: "linear-gradient(145deg, rgba(0,210,211,0.8) 0%, rgba(84,160,255,0.8) 100%)",
  },
  {
    id: "004",
    name: "Pokémon Adventure 4",
    types: ["Champion", "Victory"],
    description:
      "The ultimate test awaits as trainers face the Elite Four. Only the strongest will become champions.",
    image: "/4.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(95,39,205,0.8) 0%, rgba(165,94,234,0.8) 100%)",
  },
  {
    id: "005",
    name: "Pokémon Adventure 5",
    types: ["Legend", "Destiny"], 
    description:
      "The final chapter where destinies are fulfilled and legends are born. The greatest adventure concludes here.",
    image: "/5.jpg",
    backgroundSrc: "coverBG2.jpeg",
    background: "linear-gradient(145deg, rgba(255,159,243,0.8) 0%, rgba(243,104,224,0.8) 100%)",
  },
  {
    id: "006",
    name: "Pokémon Adventure 6",
    types: ["Evolution", "Transformation"],
    description:
      "Witness the incredible power of evolution as Pokémon reach their ultimate forms through bonds of trust and training.",
    image: "/6.jpg",
    backgroundSrc: "coverBG3.png",
    background: "linear-gradient(145deg, rgba(255,184,77,0.8) 0%, rgba(255,121,63,0.8) 100%)",
  },
  {
    id: "007",
    name: "Pokémon Adventure 7",
    types: ["Eternal", "Bond"],
    description:
      "The ultimate story of friendship and courage. Where every ending becomes a new beginning in the endless world of Pokémon.",
    image: "/7.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(116,185,255,0.8) 0%, rgba(162,155,254,0.8) 100%)",
  },
];

export default pages;
