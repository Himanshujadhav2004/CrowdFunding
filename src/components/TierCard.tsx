import React from "react";
import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { useReadContract } from "thirdweb/react";


type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  contract: ThirdwebContract;
  index:number;
  isEditing:boolean;
};

function TierCard({ tier, contract ,index,isEditing }: TierCardProps) 
{
  const { data:status, isPending:isloadingstatus } = useReadContract({
    contract,
    method:
      "function getCampaignStatus() view returns (uint8)",
    params: [],
  });
  return (
    <div className="max-w-sm mb-4 flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-lg shadow">
      <div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">{tier.name}</p>
          <p className="text-2xl font-semibold">${tier.amount.toString()}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs font-semibold">Total Backer: {tier.backers.toString()}</p>
        {!isloadingstatus && (status === 0) ? (
  <TransactionButton
    transaction={() => prepareContractCall({
      contract,
      method: "function fund(uint256 _tierIndex) payable",
      params: [BigInt(index)],
      value: tier.amount,
    })}
    onTransactionConfirmed={async () => alert("Transaction Successful")}
    style={{
      marginTop: "1rem",
      backgroundColor: "#2563EB",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      cursor: "pointer",
    }}
  >
    Select
  </TransactionButton>
) : (
  <p>Status is Rejected or Completed</p>
)}

{/* <button onClick={() =>onClick} >Send</button> */}
      </div>
      {isEditing && (
        <TransactionButton transaction={() =>prepareContractCall({
          contract,
          method: "function removeTier(uint256 _index)",
          params: [BigInt(index)]
        })} onTransactionConfirmed={async =>alert("Removed")} style={{marginTop:"1rem" , backgroundColor:"red", color:"white",padding:"0.5rem 1rem", borderRadius:"0.375rem",cursor:"pointer"}}>Remove</TransactionButton>
      )}
    </div>
  );
}

export default TierCard;
