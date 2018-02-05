pragma solidity 0.4.18;

contract Database {

    struct data {
        bool isRegistered;
    }

    mapping (address => data) registeredAddresses;

    function registerAddress(address addressToRegister)
        public
    {
        require(!registeredAddresses[addressToRegister].isRegistered);

        registeredAddresses[addressToRegister] = data({ isRegistered : true});
    }

    function deRegisterAddress(address addressToDeRegister)
        public
    {
        require(isAddressRegistered(addressToDeRegister));

        delete registeredAddresses[addressToDeRegister];
    }

    function isAddressRegistered(address addressToCheck)
        view
        public
        returns(bool)
    {
        return registeredAddresses[addressToCheck].isRegistered;
    }
}
