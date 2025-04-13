import TokenSelector from "@/components/TokenSelector";

const Header = () => {
  return (
    <header className="hidden md:flex relative z-51 h-full items-center bg-[var(--color-header-bg)] px-4 py-2 shadow-md md:h-20 md:flex-row">
      <TokenSelector isHeader={true} />
    </header>
  );
};

export default Header;
