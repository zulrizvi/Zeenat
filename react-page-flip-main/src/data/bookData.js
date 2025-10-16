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
    id: "...",
    name: "Phulo ka safar",
    types: ["Khuub", "Phuul"],
    description:
      "Hazaaro laakho phuulo me bhi ek aziiz shakhs nazar ko khwahish e diid hai.",
    image: "/1.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(255,107,107,0.8) 0%, rgba(238,90,36,0.8) 100%)",
  },
  {
    id: "002", 
    name: "Samundar sa ek dil",
    types: ["Dil", "Azmat"],
    description:
      "Us nigar e yaar ka wo chashm-e-mai-farosh, phuulo me jaise aap taraashe hue se hai, ek titli ke paro ko bachane ke liye jaise aap ne samundar sa ek dil ko qurbaan kiya hai",
    image: "/2.jpg",
    backgroundSrc: "coverBG2.jpeg",
    background: "linear-gradient(145deg, rgba(72,52,212,0.7) 0%, rgba(104,109,224,0.7) 100%)",
  },
  {
    id: "003",
    name: "Mehndi ki Khushboo", 
    types: ["Zulf", "Mehndi"],
    description:
      "Vo zulfo ki ghani chaaw me vo neend ka dera \naannkho me khilti hui vo siyaah kajal ka basera \naur to rang e hina aapke hatho par beyhadd haseen lgta hai lagaya kijiye aksar",
    image: "/3.jpg",
    backgroundSrc: "coverBG3.png",
    background: "linear-gradient(145deg, rgba(0,210,211,0.8) 0%, rgba(84,160,255,0.8) 100%)",
  },
  {
    id: "004",
    name: "Tabassum",
    types: ["Tabassum", "Fatah"],
    description:
      "Qaraar hai tere tabassum se mujhe \nTu ruuth kar mujhse kabhi duur na jaiyo. \nAapki musalsal khushi se ek fatah ka andesha hota hai",
    image: "/4.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(95,39,205,0.8) 0%, rgba(165,94,234,0.8) 100%)",
  },
  {
    id: "005",
    name: "Ham-Nashiin",
    types: ["Gham", "Guftaar"], 
    description:
      "Gham ye zamaane ke mere, mujhse duur ho jaate hai tu jb bhi mujhse ek lafz hi gar baat jo kar le.",
    image: "/5.jpg",
    backgroundSrc: "coverBG2.jpeg",
    background: "linear-gradient(145deg, rgba(255,159,243,0.8) 0%, rgba(243,104,224,0.8) 100%)",
  },
  {
    id: "006",
    name: "Adaaegi",
    types: ["Shokhi", "Andaz"],
    description:
      "Shokhi aur Adaaegi jo aapke chilman se lage hai, isko kabhi jhatka na kare  aap varna dil aapka mehruum sa ho jaaega ",
    image: "/6.jpg",
    backgroundSrc: "coverBG3.png",
    background: "linear-gradient(145deg, rgba(255,184,77,0.8) 0%, rgba(255,121,63,0.8) 100%)",
  },
  {
    id: "007",
    name: "Khwabiida",
    types: ["Khwab", "Neend"],
    description:
      "Soe hue hirni ke maanind jo lagte ho yaqeenan khwab me khud se mulaaqaat ki hogi aapne",
    image: "/7.jpg",
    backgroundSrc: "CoverBG.png",
    background: "linear-gradient(145deg, rgba(116,185,255,0.8) 0%, rgba(162,155,254,0.8) 100%)",
  },
];

export default pages;
