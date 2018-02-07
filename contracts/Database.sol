pragma solidity 0.4.18;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract Database is Ownable {

    struct RegistrationData {
        address next;
        address prev;
    }

    mapping (address => RegistrationData) private registeredAddresses;
    address public firstAddress;

    function registerAddress(address addressToRegister)
        external
        onlyOwner
    {
        require(!isAddressRegistered(addressToRegister));
        require(addressToRegister != address(0));

        address pointerToNextAddress =
            firstAddress == 0 ?
                addressToRegister :
                firstAddress;
        registeredAddresses[addressToRegister] =
            RegistrationData({
                next: pointerToNextAddress,
                prev: 0
            });

        if (firstAddress != 0)
            registeredAddresses[firstAddress].prev = addressToRegister;

        firstAddress = addressToRegister;
    }

    function deRegisterAddress(address addressToDeRegister)
        external
        onlyOwner
    {
        require(isAddressRegistered(addressToDeRegister));

        address deRegisteredAddressNext =
            registeredAddresses[addressToDeRegister].next;
        address deRegisteredAddressPrev =
            registeredAddresses[addressToDeRegister].prev;

        // when deleting last address
        if (deRegisteredAddressNext == addressToDeRegister) {
            if (firstAddress == addressToDeRegister) {
                firstAddress = 0;
            } else {
                registeredAddresses[deRegisteredAddressPrev].next =
                    deRegisteredAddressPrev;
            }
        } else
        // when deleting first address
        if (firstAddress == addressToDeRegister) {
            firstAddress = deRegisteredAddressNext;
            registeredAddresses[deRegisteredAddressNext].prev = 0;
        } else {
            registeredAddresses[deRegisteredAddressNext].prev =
                deRegisteredAddressPrev;
            registeredAddresses[deRegisteredAddressPrev].next =
                deRegisteredAddressNext;
        }

        delete registeredAddresses[addressToDeRegister];
    }

    function deRegisterAll()
        external
        onlyOwner
    {
        address addressPointer = firstAddress;
        uint addressCount = countAddresses();

        for (uint i = 0; i < addressCount; i++) {
            address nextAddressPointer = registeredAddresses[addressPointer].next;
            delete registeredAddresses[addressPointer];
            addressPointer = nextAddressPointer;
        }

        firstAddress = 0;
    }

    function getAllAddresses()
        public
        view
        returns(address[])
    {
        uint addressCount = countAddresses();
        address[] memory addressList = new address[](addressCount);
        address currentAddressPointer = firstAddress;

        for (uint i = 0; i < addressCount; i++) {
            addressList[i] = currentAddressPointer;
            currentAddressPointer =
                registeredAddresses[currentAddressPointer].next;
        }

        return addressList;
    }

    function isAddressRegistered(address addressToCheck)
        public
        view
        returns(bool)
    {
        return registeredAddresses[addressToCheck].next != 0;
    }

    function getNextAddress(address predecessor)
        public
        view
        returns(address)
    {
        return registeredAddresses[predecessor].next;
    }

    function countAddresses()
        public
        view
        returns(uint)
    {
        uint counter = 0;
        address currentAddressPointer = firstAddress;

        while (currentAddressPointer != 0) {
            if (registeredAddresses[currentAddressPointer].next == currentAddressPointer)
                currentAddressPointer = 0;
            else
                currentAddressPointer = registeredAddresses[currentAddressPointer].next;
            counter++;
        }

        return counter;
    }
}
