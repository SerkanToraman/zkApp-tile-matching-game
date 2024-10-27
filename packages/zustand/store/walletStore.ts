import { create } from "zustand";
import { Wallet, WalletInfo } from "@repo/chain/wallet"; // Import Wallet class from @repo/chain

interface WalletState {
  walletInfo: WalletInfo;
  connect: () => Promise<void>;
  disconnect: () => void;
  setAccount: (account: string | null) => void;
}

const wallet = typeof window !== "undefined" ? new Wallet() : null; // Ensure wallet is created only in the client environment

export const useWalletStore = create<WalletState>((set) => ({
  walletInfo: wallet
    ? wallet.getWalletInfo()
    : { account: null, network: null, isConnected: false }, // Initialize with the default wallet info

  // Connect to the wallet and update the Zustand state
  connect: async () => {
    if (wallet) {
      const walletInfo = await wallet.connect();
      set({ walletInfo });
    }
  },

  // Disconnect the wallet and update the Zustand state
  disconnect: () => {
    if (wallet) {
      const walletInfo = wallet.disconnect();
      set({ walletInfo });
    }
  },

  // Optional: If you need to update the account manually
  setAccount: (account: string | null) => {
    if (wallet) {
      set((state) => ({
        walletInfo: {
          ...state.walletInfo,
          account: account ? PublicKey.fromBase58(account) : null,
          network: state.walletInfo.network ?? null, // Ensures `network` is always `ChainInfoArgs | null`
        },
      }));
    }
  },
}));
