import { type Source as ApiSource } from "@prisma/client";
import Source from "~/models/Source";

export function adaptSourceFromApi(source: ApiSource): Source {
  return new Source(source.id, source.name, source.parser);
}
