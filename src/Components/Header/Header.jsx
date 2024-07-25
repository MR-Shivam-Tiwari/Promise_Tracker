import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { toggleSidebar } from "./utils";

export default function Header() {
  return (
    <IconButton
      sx={{
        display: { xs: "flex", md: "none" },
      }}
      onClick={() => toggleSidebar()}
      variant="outlined"
      color="neutral"
      size="sm"
    >
      <MenuIcon />
    </IconButton>
  );
}
