import React from "react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { useReadContract } from "thirdweb/react";
import { Link } from "react-router-dom";
import { baseSepolia } from "thirdweb/chains";

type CampaignCardProps = {
  campaignAddress: string;
};

export default function Campaign({ campaignAddress }: CampaignCardProps) {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });
  const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });
  const { data: goal, isLoading: isLoadGoal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });
  const { data: balance, isLoading: isLoadBalance } = useReadContract({
    contract,
    method: "function getcontractBalance() view returns (uint256)",
    params: [],
  });
  const { data: status, isPending } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  // Convert status to a readable format
  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return "Active";
      case 1:
        return "Completed";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const totalBalance = balance?.toString() || "0";
  const totalGoal = goal?.toString() || "1"; // Prevent division by zero
  let balancePercentage = (parseInt(totalBalance) / parseInt(totalGoal)) * 100;
  if (balancePercentage > 100) balancePercentage = 100;

  return (
    <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{campaignName || "Campaign Name"}</h2>
      <p className="text-gray-600 mb-4">{campaignDescription || "No description available."}</p>
      <p className="text-gray-600 mb-4">
        Status: {status !== undefined ? getStatusText(status) : "Loading..."}
      </p>
      {!isLoadBalance && !isLoadGoal && (
        <div className="w-full">
          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-6 bg-green-500"
              style={{ width: `${balancePercentage}%` }}
            ></div>
            <p className="absolute left-2 text-white text-sm font-semibold">
              ${totalBalance}
            </p>
            <p className="absolute right-2 text-white text-sm font-semibold">
              {balancePercentage >= 100 ? "Goal Achieved" : `${balancePercentage.toFixed(2)}%`}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-600">Goal: ${totalGoal}</p>
        <p className="text-gray-600">Balance: ${totalBalance}</p>
      </div>
      
      <Link to={`/Campaign/${campaignAddress}`}>
        <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
          View Campaign
        </p>
      </Link>
    </div>
  );
}
