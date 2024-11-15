import { createThirdwebClient } from "thirdweb";

// Environment variable usage
const clientId =import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: clientId,
});
