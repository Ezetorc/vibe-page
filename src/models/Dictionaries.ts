import { Dictionary } from "./Dictionary";
import { Language } from "./Language";

export type Dictionaries = { [key in Language]: Dictionary }