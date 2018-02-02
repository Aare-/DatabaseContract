pragma solidity 0.4.18;

contract Database {

    mapping (address => bool) registeredAddresses;

    function registerAddress(address addressToRegister)
        public
    {
        require(!registeredAddresses[addressToRegister]);

        registeredAddresses[addressToRegister] = true;
    }
}
