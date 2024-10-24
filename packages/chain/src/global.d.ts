interface MinaProvider {
  requestAccounts(): Promise<string[]>;
  requestNetwork(): Promise<ChainInfoArgs>;
  switchChain(args: SwitchChainArgs): Promise<any>;
}

interface Window {
  mina?: MinaProvider;
}
