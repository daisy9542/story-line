import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full items-center border-b px-8">
      <div className="flex h-18 items-center gap-2 md:gap-4">
        <div>StoryLine</div>
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
}
