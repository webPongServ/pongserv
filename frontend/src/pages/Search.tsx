import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/global.scss";

import { Input } from "@mui/joy";
import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import List from "@mui/material/List";

const Search = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<string[]>([
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
  ]);
  return (
    <Box
      className="flex-container"
      sx={{ flexDirection: "column", height: "100%", gap: 1 }}
    >
      <Box
        className="flex-container"
        sx={{ width: "100%", height: "10%", gap: 1 }}
      >
        <SearchIcon />
        <Input
          placeholder="유저 이름을 입력하세요."
          sx={{ width: "50%" }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </Box>
      <List sx={{ height: "60%", width: "50%", overflow: "auto" }}>
        {searchedUser.map((value, index) => (
          <ListItem key={value} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: true ? "initial" : "center",
                px: 2.5,
              }}
              onClick={() => {
                navigate(`/profile/${index}`);
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: true ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={value} sx={{ opacity: true ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Search;
