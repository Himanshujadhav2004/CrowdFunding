import React, { useState } from "react";
import { getContract, ThirdwebContract } from "thirdweb";
import { client } from "../../client";
import { useParams } from "react-router-dom";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { sendTransaction } from "thirdweb";
import TierCard from "../../components/TierCard";
import { baseSepolia } from "thirdweb/chains";
import { prepareContractCall } from "thirdweb";
import { useEffect } from "react";

function CampaignPage() {
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [daysToExtend, setDaysToExtend] = useState(0); // New state for days to extend
  const [deadlineUpdated, setDeadlineUpdated] = useState(false);
  const account = useActiveAccount();
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  const { data: name, isLoading: isLoadName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: deadLine, isLoading: isLoadDeadline } = useReadContract({
    contract,
    method: "function deadLine() view returns (uint256)",
    params: [],
  });
  let deadLineDate = new Date(parseInt(deadLine?.toString() as string) * 1000);
  const deadLinePasses = deadLineDate < new Date();
function abc(){   deadLineDate = new Date(parseInt(deadLine?.toString() as string) * 1000);
  const deadLinePasses = deadLineDate < new Date();
}



  const { data: description } = useReadContract({
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

  const totalBalance = balance?.toString() || "0";
  const totalGoal = goal?.toString() || "1";
  let balancePercentage = (parseInt(totalBalance) / parseInt(totalGoal)) * 100;
  if (balancePercentage > 100) {
    balancePercentage = 100;
  }

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract,
    method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner, isLoading: isLoadOwner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status, isPending } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  // const handleWithdraw = async () => {
  //   const transaction = await prepareContractCall({
  //     contract,
  //     method: "function withdraw()",
  //     params: [],
  //   });
  //   await sendTransaction({
  //     transaction,
  //     account: account!,
  //   });
  //   setDeadlineUpdated(!deadlineUpdated);
  // };

  // useEffect(() => {
  // abc();
  // }, [deadlineUpdated]);

  // const handleExtendDeadline = async () => {
  //   const transaction = await prepareContractCall({
  //     contract,
  //     method: "function extendDeadLine(uint256 _daysAdded)",
  //     params: [BigInt(daysToExtend)],
  //   });
  //   await sendTransaction({
  //     transaction,
  //     account: account!,
  //   });
  // };
  // const getStatusText = (status: number): string => {
  //   switch (status) {
  //     case 0:
  //       return "Active";
  //     case 1:
  //       return "Completed";
  //     case 2:
  //       return "Rejected";
  //     default:
  //       return "Unknown";
  //   }
  // };
  
  const handleWithdraw = async () => {
    return prepareContractCall({
      contract,
      method: "function withdraw()",
      params: [],
    });
  };
  
  const handleExtendDeadline = async () => {
    return prepareContractCall({
      contract,
      method: "function extendDeadLine(uint256 _daysAdded)",
      params: [BigInt(daysToExtend)],
    });
  };
  
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
  
  // useEffect example
  useEffect(() => {
    const deadLineDate = new Date(parseInt(deadLine?.toString() || "0") * 1000);
    const deadLinePasses = deadLineDate < new Date();
  }, [deadlineUpdated, deadLine]);
  

  return (
    <div className="container mx-auto max-w-7xl px-4 mt-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {!isLoadName && <p className="text-4xl font-semibold">{name}</p>}
        </div>
        {owner === account?.address && (
          <div className="flex items-center space-x-4">
            <div
              className="cursor-pointer rounded-lg px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </div>
            {goal === balance && (
              <TransactionButton transaction={handleWithdraw} theme={lightTheme()}>
                Withdraw
              </TransactionButton>
            )}
          </div>
        )}
      </div>

      <div className="my-6 space-y-4">
        <div>
          <p className="text-lg font-semibold">Description</p>
          <p className="text-gray-700">{description}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Deadline</p>
          <p className="text-gray-700">{deadLineDate.toDateString()}</p>
        </div>

        {isEditing && (
          <div className="my-4">
            <label>Extend Deadline by Days:</label>
            <input
              type="number"
              value={daysToExtend}
              onChange={(e) => setDaysToExtend(parseInt(e.target.value))}
              className="ml-2 px-2 py-1 rounded bg-gray-200"
              placeholder="Enter days"
            />
            {/* <button
              
              onClick={handleExtendDeadline}
            >
              Extend Deadline
            </button> */}

            <TransactionButton onTransactionConfirmed={()=>alert("Date Extended Successfully")} style={{height:"32px", backgroundColor:"blue"  ,marginLeft:"10px", color:"white"}} transaction={handleExtendDeadline}>Extend Deadline</TransactionButton>
          </div>
        )}

        <div>
          <p className="text-lg font-semibold">Status</p>
          <p className="text-gray-600 mb-4">
       {status !== undefined ? getStatusText(status) : "Loading..."}
      </p>
        </div>

        {!isLoadBalance && !isLoadGoal && (
          <div className="w-full mt-6">
            <p className="text-lg font-semibold">Campaign Goal</p>
            <p className="text-gray-700">{`${goal}$`}</p>
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="absolute top-0 left-0 h-6 bg-green-500"
                style={{ width: `${balancePercentage}%` }}
              ></div>
              <p className="absolute left-2 text-white text-sm font-semibold">
                ${totalBalance}
              </p>
              <p className="absolute right-2 text-white text-sm font-semibold">
                {balancePercentage >= 100
                  ? "Goal Achieved"
                  : `${balancePercentage.toFixed(2)}%`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="my-6">
        <p className="text-lg font-semibold">Tiers</p>
        <div>
          {isLoadingTiers ? (
            <p>Loading...</p>
          ) : (
            tiers && tiers.length > 0 ? (
              tiers.map((tier, index) => (
                <TierCard
                  isEditing={isEditing}
                  key={index}
                  index={index}
                  tier={tier}
                  contract={contract}
                />
              ))
            ) : (
              <p>No Tiers Available</p>
            )
          )}
        </div>
        {isEditing && (
          <button
            className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg px-6 py-2 mt-4 mx-auto sm:mx-0"
            onClick={() => setIsModelOpen(true)}
          >
            + Add Tier
          </button>
        )}
      </div>

      {isModelOpen && (
        <CreateTierModal setIsModelOpen={setIsModelOpen} contract={contract} />
      )}
    </div>
  );
}



export default CampaignPage;

type CreateTierModelP = {
  setIsModelOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateTierModal = ({ setIsModelOpen, contract }: CreateTierModelP) => {
  const [tierName, setTierName] = useState<string>("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Funding Tier</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModelOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Tier Name:</label>
          <input
            type="text"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Tier Amount:</label>
          <input
            type="number"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            placeholder="Tier Amount"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
        </div>
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract,
              method: "function addTier(string _name, uint256 _amount)",
              params: [tierName, tierAmount],
            })
          }
          theme={lightTheme()}
        onTransactionConfirmed={()=>{alert("Tier Added Succesfully"); setIsModelOpen(false)}}>
          Create Tier
        </TransactionButton>
      </div>
    </div>
  );
};
