export default function ToggleMenu() {
  return (
    <div
      className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
      role="menu"
    >
      <div className="p-2">
        <a
          href="#"
          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          role="menuitem"
        >
          My profile
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          role="menuitem"
        >
          Settings
        </a>
      </div>

      <div className="p-2">
        <form method="POST" action="#">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            role="menuitem"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
