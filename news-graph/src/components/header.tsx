import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full items-center border-b px-8">
      <div className="flex h-18 items-center gap-2 md:gap-4">
        <div className="flex items-center">
          <Image
            src="/LOGO.png"
            alt="StoryLine Logo"
            width={156}
            height={36}
            className="object-contain"
          />
        </div>
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
}
