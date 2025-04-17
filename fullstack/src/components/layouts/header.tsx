import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";

const Header = () => {
  return (
    <header className="relative flex h-16 items-center justify-between px-4 py-2">
      <TokenSelector />
      <ThemeToggle />
    </header>
  );
};

export default Header;
