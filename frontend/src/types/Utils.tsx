export interface CustomInputProps {
  name: string;
  defaultValue: string;
  handleFunction: React.ChangeEventHandler<HTMLInputElement>;
}

export interface CustomSliderProps {
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  handleFunction: any;
}

export interface CustomSelectProps {
  name: string;
  defaultValue: string;
  setIsPublic: Function;
  handleFunction: any;
}
