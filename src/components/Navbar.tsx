import { UserButton } from "@clerk/nextjs";
import { inter } from "@/fonts/fonts";

export default function Navbar() {
  return (
    <nav
      className={`${inter.className} fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Heading */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Right side - User Button */}
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard:
                    "bg-gray-800 border border-gray-700 text-white",
                  userButtonPopoverActionButton: "hover:bg-gray-700 text-white",
                  userButtonPopoverActionButtonText: "text-white",
                  userButtonPopoverFooter: "border-t border-gray-700"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
