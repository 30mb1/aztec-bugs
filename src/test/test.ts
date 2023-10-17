import {TestContract} from '../artifacts/Test.js'
import {
  AccountWallet,
  AccountWalletWithPrivateKey,
  AztecAddress,
  CompleteAddress,
  Contract,
  createPXEClient,
  Fr, getSandboxAccountsWallets,
  PXE,
  TxStatus,
  waitForSandbox,
  Wallet,
} from '@aztec/aztec.js'


const setupSandbox = async () => {
  const { PXE_URL = 'http://localhost:8080' } = process.env
  const pxe = createPXEClient(PXE_URL)
  await waitForSandbox(pxe)
  return pxe
}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}


describe('ZK Contract Tests', () => {
  let owner: AccountWalletWithPrivateKey
  let _account2: AccountWalletWithPrivateKey
  let _account3: AccountWalletWithPrivateKey
  let vaultAddress: AztecAddress
  let contractAddress: AztecAddress
  let pxe: PXE;

  async function getVault(wallet: AccountWalletWithPrivateKey, address: AztecAddress) {
    return TestContract.at(address, wallet);
  }

  describe('Setup', async() => {
    it('Init sandbox', async () => {
      pxe = await setupSandbox();
      [owner, _account2, _account3] = await getSandboxAccountsWallets(pxe);
      const [a] = await pxe.getRegisteredAccounts();
      console.log(owner.getAddress().toString(), a.address.toString());
    });

    it('Deploy test', async function() {
      const vault = await TestContract.deploy(pxe).send().deployed();
      vaultAddress = vault.address;
      console.log(vaultAddress.toString())
    });
  });

  describe('Test', async() => {
    it('Open position',async () => {
      const vault = await getVault(owner, vaultAddress);

      const tx0 = await vault.methods.test().send().wait();
      console.log(tx0);

      await delay(5000);

      const res = await vault.methods.test_get().view();
      console.log(res);
      return;
    });
  });
});
