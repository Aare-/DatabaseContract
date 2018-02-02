pragma solidity 0.4.18;

contract Database {

    mapping (address => bool) registeredAddresses;

    function registerAddress(address addressToRegister)
        public
    {
        require(!registeredAddresses[addressToRegister]);

        registeredAddresses[addressToRegister] = true;
    }

    function deRegisterAddress(address addressToDeRegister)
        public
    {
        require(registeredAddresses[addressToDeRegister]);

        registeredAddresses[addressToDeRegister] = false;
    }

    function isAddressRegistered(address addressToCheck)
        view
        public
        returns(bool)
    {
        return registeredAddresses[addressToCheck];
    }
}
