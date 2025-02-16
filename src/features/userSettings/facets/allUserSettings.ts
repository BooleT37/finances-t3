import { useQuery } from "@tanstack/react-query";
import { userSettingsQueryParams } from "../api/userSettingsApi";

export const useUserSettings = () => useQuery(userSettingsQueryParams);
