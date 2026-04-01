import { useGetUserProfile } from "@workspace/api-client-react";

export function useUserLanguage(): string {
  const { data: profile } = useGetUserProfile();
  return profile?.selectedLanguage ?? "sq";
}
