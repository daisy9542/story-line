import AppLayout from "./layouts/AppLayout";
import Header from "./layouts/Header";
import GraphView from "./pages/GraphView";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#101827",
      paper: "#1C2433",
    },
    primary: {
      main: "#3B82F6",
    },
    secondary: {
      main: "#10B981",
    },
    error: {
      main: "#EF4444",
    },
    text: {
      primary: "#E5E7EB",
      secondary: "#9CA3AF",
    },
    divider: "#2F3A4B",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // 移除默认渐变背景
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppLayout>
        <Header />
        <GraphView />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
