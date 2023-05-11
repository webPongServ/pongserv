import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomOnKeyUpInput from "components/utils/CustomOnKeyUpInput";
import CustomProfileButton from "components/utils/CustomProfileButton";
import { UserDetail } from "types/Detail";
import UserService from "API/UserService";
import "styles/global.scss";
import "styles/Search.scss";

import { Box, ListItem, List } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface serverFriend {
  nickname: string;
  imgPath: string;
  status: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<UserDetail[]>([]);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setValue(target.value);
    }
  };

  const getSearched = async () => {
    const response = await UserService.getSearchedUser(value);

    setSearchedUsers(
      response.data.map(
        (value: serverFriend): UserDetail => ({
          nickname: value.nickname,
          imgURL: value.imgPath,
          status: value.status,
        })
      )
    );
  };

  useEffect(() => {
    getSearched();
  }, [value]);

  return (
    <Box id="Search" className="flex-container">
      <Box id="input-box" className="flex-container">
        <SearchIcon />
        <CustomOnKeyUpInput
          defaultValue=""
          placeholder="유저 이름을 입력하세요."
          maxLength={10}
          handleFunction={handleValue}
          handleDoneTyping={() => {}}
          isError={false}
        />
      </Box>
      <List id="result-box" className="overflow">
        {searchedUsers.length === 0 ? (
          <Box className="flex-container" style={{}}>
            검색 결과가 없습니다.
          </Box>
        ) : (
          searchedUsers.map((value, index) => (
            <ListItem key={value.nickname + index} disablePadding>
              <CustomProfileButton
                class=""
                nickname={value.nickname}
                imgURL={value.imgURL}
                position="Search"
                handleFunction={() => {
                  navigate(`/profile/${value.nickname}`);
                }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default Search;
