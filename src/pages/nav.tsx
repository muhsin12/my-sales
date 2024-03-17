import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useState, useEffect } from "react";
import { fetchUserSession } from "@/services/user-service";
const settings = ["Profile", "Account", "Dashboard", "Logout"];
interface User {
  username: string;
  role: string;
  // Add more properties as needed
}
interface NavType {
  headerName: string;
  link: string;
}

const pagesData: NavType[] = [
  { headerName: "Pos", link: "/pos" },
  { headerName: "Category", link: "category" },
  { headerName: "Items", link: "products" },
  { headerName: "Sales Data", link: "sales" },
  { headerName: "Expense Category", link: "expense-category" },
  { headerName: "Expense Data", link: "expenses" },
];
const Nav: React.FC = () => {
  const [userSession, setUserSession] = useState(false);
  const [pages, setPages] = useState<NavType[]>(pagesData);

  const [filteredPage, setFilteredPage] = useState<NavType[]>([]);
  const [userSessionData, setUserSessionData] = useState<User | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const userData = fetchUserSession();
    if (userData) {
      setUserSession(true);
      setUserSessionData(userData);
      const filteredPageData =
        userData?.role === "admin"
          ? pages
          : pages?.filter((page) => page.headerName !== "Expense Data");
      setFilteredPage(filteredPageData);
    } else {
      setUserSession(false);
    }
  }, []);

  return (
    <AppBar position="static" style={{ background: "#00838f" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Restaurant POC
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {filteredPage.map((page) => (
              <Link href={page.link} key={page.link}>
                <Button
                  key={page.headerName}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.headerName}
                </Button>
              </Link>
            ))}
            {userSession && (
              <Link href="#">
                <Button
                  onClick={logout}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Nav;
