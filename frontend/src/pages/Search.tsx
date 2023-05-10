import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomOnKeyUpInput from "components/common/utils/CustomOnKeyUpInput";
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

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setValue(target.value);
    }
  };

  return (
    <Box id="Search" className="flex-container">
      <Box id="input-box" className="flex-container">
        <SearchIcon />
        <CustomOnKeyUpInput
          defaultValue=""
          placeholder="유저 이름을 입력하세요."
          maxLength={8}
          handleFunction={handleValue}
          handleDoneTyping={() => {}}
          isError={false}
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
