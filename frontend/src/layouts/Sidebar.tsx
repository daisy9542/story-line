import { Button, Slider, Box, Typography, Stack } from "@mui/material";
import { ListIcon } from "@/components/Icons";
import KolSearch from "@/components/FilterCondition/KOLSearch";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <div className="relative">
      <div
        className={`absolute top-0 transition-all duration-200 md:duration-300 ease-in-out right-[5px] z-10 flex flex-col gap-2 p-4 !will-change-transform ${
          isOpen ? "translate-x-[-405px]" : "translate-x-[-5px]"
        }`}
      >
        <Button
          variant="contained"
          disableElevation
          sx={{
            minWidth: 0,
            borderRadius: "10px",
            background: "linear-gradient(to right, #2E3A4A, #1E293B)",
            boxShadow: "none",
            "&:hover": {
              background: "linear-gradient(to right, #374151, #1E293B)",
            },
          }}
          onClick={() => onToggle()}
        >
          <ListIcon />
        </Button>
      </div>
      <aside
        className={`absolute right-0 z-30 flex h-full duration-300 sm:duration-200 ease-in-out no-scrollbar transition-all bg-gray-900 overflow-hidden ${
          isOpen ? "px-4 w-[400px]" : "px-0 w-0"
        }`}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.2) -15px 0px 15px",
        }}
      >
        <div className="w-full flex flex-col py-4 mx-4 gap-4">
          <KolSearch />
          <Box className="ml-2">
            <Typography id="input-slider" gutterBottom>
              Followers
            </Typography>
            <Slider
              defaultValue={1000}
              valueLabelDisplay="auto"
              step={1000}
              min={1000}
              max={100000}
            />
          </Box>
          <Box className="ml-2">
            <Typography id="input-slider" gutterBottom>
              Time
            </Typography>
            <Slider
              defaultValue={1000}
              valueLabelDisplay="auto"
              step={1}
              min={1}
              max={30}
            />
          </Box>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
