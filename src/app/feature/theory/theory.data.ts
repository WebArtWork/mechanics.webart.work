import theoriesData from '../../../data/theory/theories.json';
import { Theory } from './theory.interface';

/** All theories with their text in both languages. Heavy: import it only from the pages that show the text. */
export const THEORIES = theoriesData as Theory[];
