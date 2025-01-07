import { useQuery } from "@tanstack/react-query";

import { GetAvailableCredits } from "@/features/billing/server/get-available-credits";

export const useGetAvailableCredits = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return query;
}