import Image from "next/image";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brand-darkgreen text-white py-12 px-16 brand custom-size-minmax">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:mb-10">
        <div className="flex flex-col gap-2 text-center md:text-left flex-1 mb-6 md:mb-0 text-2xl md:text-lg">
          <Link href="/" className="custom-btn-hover">
            Accueil
          </Link>
          <Link href="/catalogue" className="custom-btn-hover">
            Catalogue
          </Link>
          <Link href="/a-propos" className="custom-btn-hover">
            À propos
          </Link>
          <Link href="/contact" className="custom-btn-hover">
            Contact
          </Link>
          <Link href="/connexion" className="custom-btn-hover">
            Se connecter
          </Link>
          <Link href="/inscription" className="custom-btn-hover">
            S'inscrire
          </Link>
        </div>

        {/* Colonne centre : logo + slogan */}
        <div className=" flex flex-col items-center my-4 flex-1 md:mt-6 mb-14 md:mb-0">
          <Image
            src="/logo_white.svg"
            alt="GreenRoots"
            width={160}
            height={160}
            priority
            className="md:mb-4"
          />
          <span className="mt-2">Vert l'avenir</span>
        </div>

        <div className="flex flex-col items-center flex-1 mb-14 md:items-end">
          <p className="font-semibold mb-6 text-2xl">NOUS SUIVRE</p>
          <div className="flex gap-4">
            {/* <Link> sert avant tout au routing interne <a> est préféré si externe car pas de surcouche donc plus léger*/}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-btn-hover"
            >
              <FaInstagram
                className="w-14 h-14 md:w-18 md:h-18"
              />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-btn-hover"
            >
              <FaXTwitter
                className="w-14 h-14 md:w-18 md:h-18"
              />
            </a>
            <a
              href="https://www.linkedin.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-btn-hover"
            >
              <FaLinkedin
                className="w-14 h-14 md:w-18 md:h-18"
              />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-btn-hover"
            >
              <FaFacebook
                className="w-14 h-14 md:w-18 md:h-18"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Pages légales en bas */}
      <div className="mt-4 text-center text-sm ">
        <Link href={"/mentions-legales"} className="hover:underline decoration-brand-white">
          Mentions légales - Termes et conditions
        </Link>
        <p className="py-1.5">Copyright © 2025 GreenRoots</p>
      </div>
    </footer>
  );
};

export default Footer;
