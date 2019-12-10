# ThorDemo8 - Transaction Runtime Information

## Introduction

VeChainThor provides the builtin contract `ExtensionV2` to allow a contract method to be aware of the runtime information of the transaction that invokes the method. Here by runtime, we mean the kind of information available to the method only when the method is being executed by the system. Contract `ExtentionV2` is deployed at address 

```
0x000000000000000000457874656e73696f6e5632
```

at block height 3337300 on both the mainnet and testnet. The following table lists all the methods that can be called to get different transaction runtime info. 

|Contract Method |Depscription|
|---|---|---|
|`txID()`|Get TxID at runtime.|
|`txBlockRef()`|Get `BlockRef` at runtime.|
|`txExpiration()`|Get `Expiration` at runtime.|
|`txProvedWork()`|Get `ProvedWork` at runtime.|
|`txGasPayer()`|Get the account that pays the TX fee at runtime. It is implemented due to the fact that there are two transaction-fee-delegation protocols ([MPP](https://doc.vechainworld.io/docs/multi-party-payment-protocol-mpp) and [VIP191](https://bbs.vechainworld.io/topic/242/what-you-might-not-know-about-vechainthor-yet-part-iii-transaction-fee-delegation-vip-191)) running on VechainThor.|

## Prerequisites

solidity version >= 0.5.0

## Example

```
pragma solidity >=0.5.0;

interface Extension {
    function txID() external view returns(bytes32);
}

contract TestExtension {
    address public ext;

    constructor(address _ext) public {
        ext = _ext;
    }

    function dummyFunc() public {
        bytes32 txID = Extension(ext).txID();
        emit TxID(txID);
    }

    event TxID(bytes32 indexed txID);
}
```

Contract `TestExtension` is created for the demo. Method `dummyFunc` invokes method `txID` to get the TxID of the transaction that invokes the method. It then emits an event that logs the TxID.

## Output

```
# Deploy voting contract
	TXID: 0x898fd96e7c496599cedba021c8082765582627c062d7afb9b3c231edc477a7a0
	Contract Address: 0xe836df3c018cb0b53b168a09ab7a8e1b10077f25

# Call TestExtention.dummyFunc
	TXID (obtained after sending TX): 0x713ce28832cdc22aeabeb6c3deb495e5e54792bec609ee979437b7290c524a55
	TXID (obtained at runtime and logged in Receipt): 0x713ce28832cdc22aeabeb6c3deb495e5e54792bec609ee979437b7290c524a55
```
