import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/main");
        }}
      >
        Login with 42
      </Button>
    </Box>
  );
};

export default Login;
