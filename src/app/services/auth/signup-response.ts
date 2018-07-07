import { DietPreference } from './diet-preference';

export interface SignupResponse {
  _v: number;
  username: string;
  password: string;
  _id: string;
  dietPreferences: DietPreference[];
}
