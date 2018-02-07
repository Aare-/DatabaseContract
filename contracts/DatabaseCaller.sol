pragma solidity 0.4.18;

contract DatabaseInterface {
    function firstAddress()
        view
        public
        returns(address);

    function getNextAddress(address predecessor)
        view
        public
        returns(address);

    function countAddresses()
        view
        public
        returns(uint);
}

contract DatabaseCaller {
    function collectData(address databaseAddress)
        public
        view
        returns(address[])
    {
        DatabaseInterface database = DatabaseInterface(databaseAddress);
        uint addressCount = database.countAddresses();
        address[] memory addressList = new address[](addressCount);
        address pointerAddress = database.firstAddress();

        for(uint i = 0; i < addressCount; i++) {
            addressList[i] = pointerAddress;
            pointerAddress = database.getNextAddress(addressList[i]);
        }

        return addressList;
    }
}