import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import Source from "../Source";
import { sourcesQueryParams } from "../api/sourcesApi";
import type { ApiSource } from "../api/types";

function adaptSourceFromApi(source: ApiSource): Source {
  return new Source(source.id, source.name, source.parser);
}

export const useSources = () =>
  useQuery({
    ...sourcesQueryParams,
    select: useCallback(
      (data: ApiSource[]) => data.map(adaptSourceFromApi),
      []
    ),
  });
