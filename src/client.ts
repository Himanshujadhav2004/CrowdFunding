import { createThirdwebClient } from "thirdweb";

// Environment variable usage
const clientId = "908f6111213ffd80a2b038b3c24df28e";

export const client = createThirdwebClient({
  clientId: clientId,
});
