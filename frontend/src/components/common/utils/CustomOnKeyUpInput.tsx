import { CustomOnKeyUpInputProps } from "types/Utils";
import { Input } from "@mui/joy";

const CustomOnKeyUpInput = (props: CustomOnKeyUpInputProps) => {
  let typingTimer: NodeJS.Timeout;
  let doneTypingInterval: number = 300;

  const HandleKeyUP = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(props.handleDoneTyping, doneTypingInterval);
  };

  const HandleKeyDown = () => {
    clearTimeout(typingTimer);
  };

  return (
    <Input
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      required
      slotProps={{ input: { maxLength: props.maxLength } }}
      onChange={props.handleFunction}
      onKeyUp={HandleKeyUP}
      onKeyDown={HandleKeyDown}
      error={props.isError}
    />
  );
};

export default CustomOnKeyUpInput;
