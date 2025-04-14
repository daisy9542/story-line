import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";

const Header = () => {
  return (
    <header className="z-51 relative hidden h-full items-center px-4 py-2 shadow-md md:flex md:h-20 md:flex-row">
      <TokenSelector />
      <ThemeToggle />
    </header>
  );
};

export default Header;
