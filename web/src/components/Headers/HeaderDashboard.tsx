import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

function LoginButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-5 py-2.5 text-sm mr-3 md:mr-0 font-medium text-white bg-primary rounded-md shadow"
    >
      Sign Out
    </button>
  );
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="bg-neutral border border-solid border-b-black shadow px-2 sm:px-4 py-2.5">
      <div className="container flex flex-wrap justify-start items-center mx-auto px-2 sm:px-6 lg:px-8 max-w-screen-xl">
        <Link
          href="/"
          className="flex flex-1 items-center text-primary font-bold text-md md:text-xl"
        >
          <span className="sr-only">Home</span>analyzemyrepo.com
        </Link>
        <div className="flex flex-1 md:order-2 justify-end">
          <LoginButton />
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={
            "items-center w-full md:flex md:w-auto md:order-1" +
            (isOpen ? "" : " hidden")
          }
          id="navbar-cta"
        >
          <ul className="flex flex-col space-y-2 p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-neutral md:space-y-0">
            <li>
              <Link
                href="/about"
                className="block py-2 pr-4 pl-3 text-white bg-black rounded md:bg-transparent md:text-black md:p-0"
                aria-current="page"
              >
                about
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block py-2 pr-4 pl-3 text-white bg-black rounded md:bg-transparent md:text-black md:p-0"
                aria-current="page"
              >
                dashboard
              </Link>
            </li>
            <li>
              <Link
                href="https://crowd.dev"
                className="block py-2 pr-4 pl-3 text-white bg-black rounded md:bg-transparent md:text-black md:p-0"
                aria-current="page"
                target="_blank"
                rel="noopener noreferrer"
              >
                crowd.dev
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
