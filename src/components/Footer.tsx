// import Image from "next/image";
// import { FaInstagram, FaLinkedin } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6"; //twitter
// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="bg-brand-darkgreen text-white py-12 px-16 brand custom-size-minmax">
//       {/* Haut du footer en 3 colonnes */}
//       <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8  ">
//         {/* Colonne gauche : menu */}
//         <div className="flex flex-col gap-2 text-center md:text-left">
//           <Link href="/catalogue" className="custom-btn-hover">
//             Catalogue
//           </Link>
//           <Link href="/a-propos" className="custom-btn-hover">
//             À propos
//           </Link>
//           <Link href="/contact" className="custom-btn-hover">
//             Contact
//           </Link>
//         </div>

//         {/* Colonne droite : les réseaux */}
//         <div className="flex flex-col  items-center gap-2">
//           <p className="font-semibold ">NOUS SUIVRE</p>
//           <div className="flex gap-4 text-2xl">
//             {/* <Link> sert avant tout au routing interne <a> est préféré si externe car pas de surcouche donc plus léger*/}
//             <a
//               href="https://www.instagram.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="custom-btn-hover"
//             >
//               <FaInstagram />
//             </a>
//             <a
//               href="https://x.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="custom-btn-hover"
//             >
//               <FaXTwitter />
//             </a>
//             <a
//               href="https://www.linkedin.com/home"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="custom-btn-hover"
//             >
//               <FaLinkedin />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Colonne centre : logo + slogan */}
//       <div className=" flex flex-col items-center my-4">
//         <Image
//           src="/logo_white.svg"
//           alt="GreenRoots"
//           width={100}
//           height={100}
//           priority
//         />
//         <span className="mt-2">{"Vert l'avenir"}</span>
//       </div>

//       {/* Pages légales en bas */}
//       <div className="mt-4 text-center text-sm ">
//         <Link href={"/mentions-legales"}>
//           Mentions légales - Termes et conditions
//         </Link>
//         <p className="py-1.5">Copyright © 2025 GreenRoots</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
