pragma solidity 0.4.18;


contract DatabaseInterface {
    function firstAddress()
        public
        view
        returns(address);

    function getNextAddress(address predecessor)
        public
        view
        returns(address);

    function countAddresses()
        public
        view
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

        for (uint i = 0; i < addressCount; i++) {
            addressList[i] = pointerAddress;
            pointerAddress = database.getNextAddress(addressList[i]);
        }

        return addressList;
    }
}