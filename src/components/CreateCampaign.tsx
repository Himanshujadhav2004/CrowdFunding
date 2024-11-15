import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useNavigate } from "react-router-dom";

interface Errors {
  campaignName?: string;
  campaignDescription?: string;
  campaignGoal?: string;
  campaignDeadline?: string;
}

function CreateCampaign() {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>();
  const [campaignDeadline, setCampaignDeadline] = useState<number>();
  const [isDeploying, setIsDeploying] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  // Function to validate form fields
  const validateForm = () => {
    const newErrors: Errors = {};
    
    if (!campaignName) newErrors.campaignName = "Campaign name is required.";
    if (!campaignDescription) newErrors.campaignDescription = "Campaign description is required.";
    
    if (!campaignGoal || campaignGoal <= 0) {
      newErrors.campaignGoal = "Campaign goal must be a positive number.";
    }
    
    if (!campaignDeadline || campaignDeadline <= 0) {
      newErrors.campaignDeadline = "Campaign deadline must be a valid number.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeployContract = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setIsDeploying(true);
    try {
      await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account!,
        contractParams: { 
          name: campaignName,
          description: campaignDescription,
          goal: campaignGoal,
          duration: campaignDeadline,
        },
        contractId: "CrowdFunding",
        publisher: "0x561c8D54eD5433a229B91654B4927f043782CCF0",
        version: "1.0.4",
      });
      alert("Campaign created successfully!");
      navigate("/dashboard/:id"); // Redirect to Dashboard after creation
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Create a Campaign</h2>
      
      <input
        type="text"
        placeholder="Campaign Name"
        className="w-full p-2 mb-2 border"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
      />
      {errors.campaignName && <p className="text-red-500">{errors.campaignName}</p>}
      
      <input
        type="text"
        placeholder="Campaign Description"
        className="w-full p-2 mb-2 border"
        value={campaignDescription}
        onChange={(e) => setCampaignDescription(e.target.value)}
      />
      {errors.campaignDescription && <p className="text-red-500">{errors.campaignDescription}</p>}
      
      <input
        type="number"
        placeholder="Campaign Goal"
        className="w-full p-2 mb-2 border"
        value={campaignGoal}
        onChange={(e) => setCampaignGoal(Number(e.target.value))}
      />
      {errors.campaignGoal && <p className="text-red-500">{errors.campaignGoal}</p>}
      
      <input
        type="number"
        placeholder="Campaign Deadline"
        className="w-full p-2 mb-2 border"
        value={campaignDeadline}
        onChange={(e) => setCampaignDeadline(Number(e.target.value))}
      />
      {errors.campaignDeadline && <p className="text-red-500">{errors.campaignDeadline}</p>}
      
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={handleDeployContract}
        disabled={isDeploying}
      >
        {isDeploying ? "Creating..." : "Create Campaign"}
      </button>
    </div>
  );
}

export default CreateCampaign;
