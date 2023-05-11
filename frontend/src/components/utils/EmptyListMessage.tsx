import { Box } from "@mui/material";
import "styles/global.scss";

interface EmptyListMessageProps {
  message: string;
}

const EmptyListMessage = (props: EmptyListMessageProps) => {
  return <Box className="empty-list flex-container">{props.message}</Box>;
};

export default EmptyListMessage;
