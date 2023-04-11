import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmErc20Htlc } from '../../../../packages/evm/src';
dotenv.config();

async function lock() {
  // setup
  const { PRIVATEKEY, NETWORK, TOKEN } = ETH;
  const client = new EvmErc20Htlc(NETWORK.TEST.rinkeby.erc20.endpoint, NETWORK.TEST.rinkeby.erc20.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const hashPair = client.createHashPair();
  // lock
  const result = await client.lock(toAddress, fromAddress, hashPair.secret, 1, TOKEN.JPYC);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.HTLCERC20New.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    contractInfo: await client.getContractInfo(result.events.HTLCERC20New.returnValues.contractId),
  });
}

async function start() {
  await lock();
}

start();
