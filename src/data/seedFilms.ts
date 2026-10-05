import { Film } from "@/types/film";
import catalogFilms from "./films.json";

/**
 * Verified Feature Films from Internet Archive collection
 */
export const SEED_FILMS: Film[] = catalogFilms as unknown as Film[];
