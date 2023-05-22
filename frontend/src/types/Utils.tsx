export interface CustomInputProps {
  name: string;
  defaultValue: string;
  maxLength: number;
  placeholder: string;
  handleFunction: React.ChangeEventHandler<HTMLInputElement>;
}
export interface CustomOnKeyUpInputProps {
  defaultValue: string;
  maxLength: number;
  placeholder: string;
  isError: boolean;
  handleDoneTyping: () => void;
  handleFunction: React.ChangeEventHandler<HTMLInputElement>;
}

export interface CustomSliderProps {
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  handleFunction: any;
}

export interface ChattingTypeSelectProps {
  name: string;
  defaultValue: string;
  setIsPublic: Function;
  handleFunction: any;
}

export interface GameDifficultyRadioGroupProps {
  name: string;
  defaultValue: string;
  handleFunction: any;
}

export interface CustomIconButtonProps {
  class: string;
  icon: JSX.Element;
  handleFunction: any;
}

export interface CustomProfileButtonProps {
  class: string;
  nickname: string;
  imgURL: string;
  position: string;
  handleFunction: any;
}

export interface CustomProfilePreviewProps {
  class: string;
  nickname: string;
  imgURL: string;
  position: string;
  handleFunction: any;
}
