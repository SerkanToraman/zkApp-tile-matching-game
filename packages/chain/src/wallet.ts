import { PublicKey } from "o1js";
import { ChainInfoArgs, SwitchChainArgs } from "@aurowallet/mina-provider";

export interface WalletInfo {
  account: PublicKey | null;
  network: ChainInfoArgs | null;
  isConnected: boolean;
}

export class Wallet {
  private account: PublicKey | null = null;
  private network: ChainInfoArgs | null = null;
  private isConnected = false;

  // Method to connect the wallet
  public async connect(): Promise<WalletInfo> {
    if (!window.mina) throw new Error("Wallet not installed");

    const accounts = await window.mina.requestAccounts();
    if (accounts.length > 0 && accounts[0]) {
      this.account = PublicKey.fromBase58(accounts[0]);
      this.isConnected = true;
      this.network = await window.mina.requestNetwork();
    }

    return this.getWalletInfo();
  }

  // Method to disconnect the wallet
  public disconnect(): WalletInfo {
    this.account = null;
    this.network = null;
    this.isConnected = false;
    return this.getWalletInfo();
  }

  // Method to switch network
  public async switchNetwork(args: SwitchChainArgs): Promise<WalletInfo> {
    if (!window.mina) throw new Error("Wallet not installed");

    const response = await window.mina.switchChain(args);
    if ("networkID" in response) {
      this.network = response;
    }

    return this.getWalletInfo();
  }

  // Get current wallet info
  public getWalletInfo(): WalletInfo {
    return {
      account: this.account,
      network: this.network,
      isConnected: this.isConnected,
    };
  }
}
