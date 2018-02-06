pragma solidity 0.4.18;

contract Database {

    struct RegistrationData {
        address next;
        address prev;
    }

    mapping (address => RegistrationData) private registeredAddresses;
    address public firstAddress;
    uint public addressCount = 0;

    function registerAddress(address addressToRegister)
        public
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

        if(firstAddress != 0) {
            registeredAddresses[firstAddress].prev = addressToRegister;
        }

        firstAddress = addressToRegister;
        addressCount += 1;
    }

    function deRegisterAddress(address addressToDeRegister)
        public
    {
        require(isAddressRegistered(addressToDeRegister));

        if(addressCount == 1) {
            firstAddress = 0;
        } else {
            address deRegisteredAddressNext =
                registeredAddresses[addressToDeRegister].next;
            address deRegisteredAddressPrev =
                registeredAddresses[addressToDeRegister].prev;

            // when deleting first address
            if(firstAddress == addressToDeRegister) {
                firstAddress = deRegisteredAddressNext;
                registeredAddresses[deRegisteredAddressNext].prev = 0;
            } else
            // when deleting last address
            if (deRegisteredAddressNext == addressToDeRegister) {
                registeredAddresses[deRegisteredAddressPrev].next =
                    deRegisteredAddressPrev;
            }
            // when deleting address in the middle
            else {
                registeredAddresses[deRegisteredAddressNext].prev =
                    deRegisteredAddressPrev;
                registeredAddresses[deRegisteredAddressPrev].next =
                    deRegisteredAddressNext;
            }
        }

        addressCount -= 1;

        delete registeredAddresses[addressToDeRegister];
    }

    function getAllAddresses()
        view
        public
        returns(address[])
    {
        address[] memory addressList = new address[](addressCount);
        address currentAddressPointer = firstAddress;

        for(uint i = 0; i < addressCount; i++) {
            addressList[i] = currentAddressPointer;
            currentAddressPointer =
                registeredAddresses[currentAddressPointer].next;
        }

        return addressList;
    }

    function deRegisterAll()
        public
    {
        address addressPointer = firstAddress;

        for(uint i = 0; i < addressCount; i++) {
            address nextAddressPointer = registeredAddresses[addressPointer].next;
            delete registeredAddresses[addressPointer];
            addressPointer = nextAddressPointer;
        }

        addressCount = 0;
        firstAddress = 0;
    }

    function isAddressRegistered(address addressToCheck)
        view
        public
        returns(bool)
    {
        return registeredAddresses[addressToCheck].next != 0;
    }

    function getNextAddress(address predecessor)
        view
        public
        returns(address)
    {
        return registeredAddresses[predecessor].next;
    }
}
