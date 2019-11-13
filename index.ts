import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex.driver-nodejs';

import { extensionAddr } from 'myvetools/src/built-in';
import { getABI, getSolcABI, getSolcBin } from 'myvetools/src/utils';
import { decodeEvent, getReceipt, deployContract, contractCallWithTx, } from 'myvetools/src/connexUtils';

const acc = '0x8580C3BFF10f2886B7CF183a8Eb51e76d75B42c4';
const sk = '0x29a9c5eabe185f68abeb41f4d68e04a5004c146eaa3fd8a76aa3a87b33b6f1a7';

/**
 * Main process  
 */
(async () => {
    const net = new SimpleNet("https://sync-testnet.vechain.org");
    const wallet = new SimpleWallet();
    const driver = await Driver.connect(net, wallet);
    const connex = new Framework(driver);

    wallet.import(sk);

    const timeout = 5;

    console.log('# Deploy voting contract');
    const bytecode = getSolcBin('./src/testExtension.sol', 'TestExtension');
    const abiStr = getSolcABI('./src/testExtension.sol', 'TestExtension');
    const abi = JSON.parse(abiStr);
    const addr = await deployTestExt(connex, timeout, acc, bytecode, abi, extensionAddr);

    console.log('\n# Call dummyFunc');
    const txResponse = await contractCallWithTx(
        connex, acc, 500000, addr, 0, getABI(abi, 'dummyFunc', 'function')
    );
    console.log('\ttxid: ' + txResponse.txid);
    const receipt = await getReceipt(connex, timeout, txResponse.txid);
    const decoded = decodeEvent(receipt.outputs[0].events[0], getABI(abi, 'TxID', 'event'));
    console.log('\tLogged txid: ' + decoded['txID']);

    driver.close();
})().catch(err => {
    console.log(err);
});

async function deployTestExt(
    connex: Connex, timeout: number, txSender: string, bytecode: string, abi: object[], ext: string
): Promise<string> {
    const txResponse = await deployContract(
        connex, txSender, 2000000, '0x0', bytecode, getABI(abi, '', 'constructor'), ext
    );

    console.log('\ttxid: ' + txResponse.txid);
    const receipt = await getReceipt(connex, timeout, txResponse.txid);
    const addr = receipt.outputs[0].contractAddress;
    console.log('\tAddress: ' + addr);

    return addr;
}