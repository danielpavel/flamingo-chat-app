import { SupportedLanguages } from "@/store/store";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Message {
  id?: string;
  input: string;
  timestamp: Date;
  user: User;
  translated?: { [K in SupportedLanguages]?: string };
}