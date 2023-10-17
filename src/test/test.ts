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
  let testAddress: AztecAddress
  let contractAddress: AztecAddress
  let pxe: PXE;

  async function getTest(wallet: AccountWalletWithPrivateKey, address: AztecAddress) {
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
      const test = await TestContract.deploy(pxe).send().deployed();
      testAddress = test.address;
      console.log(testAddress.toString())
    });
  });

  describe('Test', async() => {
    it('Testing',async () => {
      const vault = await getTest(owner, testAddress);

      const tx0 = await vault.methods.test().send().wait();
      console.log(tx0);

      const tx1 = await vault.methods.test2().send().wait();
      console.log(tx1);

      await delay(5000);

      const res0 = await vault.methods.test_get().view();
      console.log(res0);

      const res1 = await vault.methods.test_get2().view();
      console.log(res1);
      return;
    });
  });
});
