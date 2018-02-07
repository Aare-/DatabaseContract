pragma solidity 0.4.18;

import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";


contract DatabaseInterface {
    function isAddressRegistered(address addressToCheck)
        public
        view
        returns(bool);
}


contract DepositReceiver {

    using SafeMath for uint256;

    modifier onlyRegisteredAddresses(address addressToTest) {
        DatabaseInterface dInterface = DatabaseInterface(databaseAddress);
        require(dInterface.isAddressRegistered(addressToTest));
        _;
    }

    modifier onlyNonEmptyAmounts(uint withdrawalAmount) {
        require(withdrawalAmount > 0);
        _;
    }

    modifier onlyValidWithdrawals(address sender, uint withdrawalAmount) {
        require(balances[sender] >= withdrawalAmount);
        _;
    }

    event FundsWithdrawn(address indexed forAccount, uint256 amount);
    event DepositAccepted(address indexed fromAccount, uint256 amount);

    address private databaseAddress;
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
        external
        onlyRegisteredAddresses(msg.sender)
        onlyNonEmptyAmounts(withdrawalAmount)
        onlyValidWithdrawals(msg.sender, withdrawalAmount)
    {
        balances[msg.sender] = balances[msg.sender].sub(withdrawalAmount);

        FundsWithdrawn(msg.sender, withdrawalAmount);

        msg.sender.transfer(withdrawalAmount);
    }

    function getBalance()
        public
        onlyRegisteredAddresses(msg.sender)
        view
        returns(uint)
    {
        return balances[msg.sender];
    }

    function acceptDeposit(address sender, uint depositAmount)
        private
        onlyRegisteredAddresses(sender)
        onlyNonEmptyAmounts(depositAmount)
    {
        balances[sender] = balances[sender].add(depositAmount);
        DepositAccepted(sender, depositAmount);
    }
}
