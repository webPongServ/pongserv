import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import "styles/global.scss";
import "styles/Search.scss";

import { Input } from "@mui/joy";
import { Box, ListItem, List } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

  console.log(value, setValue, setSearchedUser);

  let typingTimer: NodeJS.Timeout;
  let doneTypingInterval: number = 300;

  const doneTyping = () => {
    console.log(123);
  };

  const HandleKeyUP = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  };

  const HandleKeyDown = () => {
    clearTimeout(typingTimer);
  };

  return (
    <Box id="Search" className="flex-container">
      <Box id="input-box" className="flex-container">
        <SearchIcon />
        <Input
          placeholder="유저 이름을 입력하세요."
          onKeyUp={HandleKeyUP}
          onKeyDown={HandleKeyDown}
        />
      </Box>
      <List id="result-box" className="overflow">
        {searchedUser.map((value, index) => (
          <ListItem key={value + index} disablePadding>
            <CustomProfileButton
              class=""
              nickname={value}
              imgURL={"../image.png"}
              position="Search"
              handleFunction={() => {
                navigate(`/profile/${index}`);
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Search;
