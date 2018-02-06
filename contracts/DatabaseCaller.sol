pragma solidity 0.4.18;

contract DatabaseInterface {
    function firstAddress()
        view
        public
        returns(address);

    function addressCount()
        view
        public
        returns(uint);

    function getNextAddress(address predecessor)
        view
        public
        returns(address);
}

contract DatabaseCaller {
    function collectData(address databaseAddress)
        public
        view
        returns(address[])
    {
        DatabaseInterface database = DatabaseInterface(databaseAddress);
        uint addressCount = database.addressCount();
        address[] memory addressList = new address[](addressCount);

        address pointerAddress = database.firstAddress();

        for(uint i = 0; i < addressCount; i++) {
            addressList[i] = pointerAddress;
            pointerAddress = database.getNextAddress(addressList[i]);
        }

        return addressList;
    }
}