pragma solidity 0.4.18;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract Database is Ownable {

    struct RegistrationData {
        address next;
        address prev;
    }

    modifier onlyValidAddresses(address addressToCheck) {
        require(addressToCheck != address(0));
        _;
    }

    modifier onlyNotRegisteredAddresses(address addressToCheck) {
        require(!isAddressRegistered(addressToCheck));
        _;
    }

    modifier onlyRegisteredAddresses(address addressToCheck) {
        require(isAddressRegistered(addressToCheck));
        _;
    }

    event AddressRegistered(address indexed involvedAddress);
    event AddressDeRegistered(address indexed involvedAddress);
    event AllAddressesRemoved();

    mapping (address => RegistrationData) private registeredAddresses;
    address public firstAddress;

    function registerAddress(address addressToRegister)
        external
        onlyOwner
        onlyValidAddresses(addressToRegister)
        onlyNotRegisteredAddresses(addressToRegister)
    {
        RegistrationData memory registrationData =
            RegistrationData({
                next: addressToRegister,
                prev: 0
            });

        if (firstAddress != address(0)) {
            registrationData.next = firstAddress;
            registeredAddresses[firstAddress].prev = addressToRegister;
        }

        registeredAddresses[addressToRegister] = registrationData;
        firstAddress = addressToRegister;

        AddressRegistered(addressToRegister);
    }

    function deRegisterAddress(address addressToDeRegister)
        external
        onlyOwner
        onlyRegisteredAddresses(addressToDeRegister)
    {
        RegistrationData storage entity = registeredAddresses[addressToDeRegister];

        if (isAddressLast(addressToDeRegister)) {
            if (isAddressFirst(addressToDeRegister)) { // only address
                firstAddress = 0;
            } else { // last address
                registeredAddresses[entity.prev].next = entity.prev;
            }
        } else if (isAddressFirst(addressToDeRegister)) { // first address
            firstAddress = entity.next;
        } else { // address in the middle
            registeredAddresses[entity.next].prev = entity.prev;
            registeredAddresses[entity.prev].next = entity.next;
        }

        delete registeredAddresses[addressToDeRegister];
        AddressDeRegistered(addressToDeRegister);
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
        AllAddressesRemoved();
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
            currentAddressPointer = registeredAddresses[currentAddressPointer].next;
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
            if (isAddressLast(currentAddressPointer))
                currentAddressPointer = 0;
            else
                currentAddressPointer = registeredAddresses[currentAddressPointer].next;
            counter++;
        }

        return counter;
    }

    function isAddressFirst(address registeredAddressToCheck)
        private
        view
        returns(bool)
    {
        return firstAddress == registeredAddressToCheck;
    }

    function isAddressLast(address registeredAddressToCheck)
        private
        view
        returns(bool)
    {
        return registeredAddresses[registeredAddressToCheck].next == registeredAddressToCheck;
    }
}
