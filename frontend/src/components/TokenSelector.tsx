import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

const TokenSelector = ({ isHeader = false }: { isHeader: boolean }) => {
  const [token, setToken] = useState<string>("ALL");

  const handleChangeToken = (event: SelectChangeEvent) => {
    setToken(event.target.value);
  };

  const bgcolor = isHeader ? "transparent" : "var(--color-btn-bg-dark)";

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 100,
      }}
      size="small"
    >
      <Select
        id="token-select"
        sx={{
          color: "white",
          bgcolor: bgcolor,
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        }}
        value={token}
        onChange={handleChangeToken}
      >
        <MenuItem
          value="ALL"
          sx={{ color: "white", bgcolor: "var(--color-btn-bg-dark)" }}
        >
          ALL
        </MenuItem>
        <MenuItem value="SOL">SOL</MenuItem>
        <MenuItem value="BTC">BTC</MenuItem>
        <MenuItem value="ETH">ETH</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TokenSelector;
