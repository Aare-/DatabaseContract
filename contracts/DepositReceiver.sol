pragma solidity 0.4.18;

import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";

contract DatabaseInterface {
    function isAddressRegistered(address addressToCheck)
        view
        public
        returns(bool);
}

contract DepositReceiver {

    using SafeMath for uint256;

    modifier onlyRegisteredAddresses(address addressToTest) {
        DatabaseInterface dInterface = DatabaseInterface(databaseAddress);
        require(dInterface.isAddressRegistered(addressToTest));
        _;
    }

    event FundsWithdrawn(address indexed forAccount, uint256 amount);

    address databaseAddress;
    mapping (address => uint) private balances;

    function DepositReceiver(address databaseAddressToUse)
        public
    {
        databaseAddress = databaseAddressToUse;
    }

    function ()
        public
        payable
    {
        acceptDeposit(msg.sender, msg.value);
    }

    function deposit()
        external
        payable
    {
        acceptDeposit(msg.sender, msg.value);
    }

    function withdraw(uint withdrawalAmount)
        onlyRegisteredAddresses(msg.sender)
        external
    {
        require(withdrawalAmount > 0);
        require(balances[msg.sender] >= withdrawalAmount);

        balances[msg.sender] =
            balances[msg.sender].sub(withdrawalAmount);

        FundsWithdrawn(msg.sender, withdrawalAmount);

        msg.sender.transfer(withdrawalAmount);
    }

    function getBalance()
        onlyRegisteredAddresses(msg.sender)
        public
        view
        returns(uint)
    {
        return balances[msg.sender];
    }

    function acceptDeposit(address sender, uint depositAmount)
        onlyRegisteredAddresses(sender)
        private
    {
        balances[sender] = balances[sender].add(depositAmount);
    }
}
