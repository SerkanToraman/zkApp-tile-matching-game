import { create } from "zustand";
import { Wallet, WalletInfo } from "@repo/chain/wallet"; // Import Wallet class from @repo/chain

interface WalletState {
  walletInfo: WalletInfo;
  connect: () => Promise<void>;
  disconnect: () => void;
  setAccount: (account: string | null) => void;
}

const wallet = new Wallet(); // Create an instance of the Wallet class

export const useWalletStore = create<WalletState>((set) => ({
  walletInfo: wallet.getWalletInfo(), // Initialize with the default wallet info

  // Connect to the wallet and update the Zustand state
  connect: async () => {
    const walletInfo = await wallet.connect();
    set({ walletInfo });
  },

  // Disconnect the wallet and update the Zustand state
  disconnect: () => {
    const walletInfo = wallet.disconnect();
    set({ walletInfo });
  },

  // Optional: If you need to update the account manually
  setAccount: (account: string | null) => {
    set((state) => ({
      walletInfo: {
        ...state.walletInfo,
        account: account ? PublicKey.fromBase58(account) : null,
      },
    }));
  },
}));
