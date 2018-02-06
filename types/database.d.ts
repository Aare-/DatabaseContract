declare module 'database' {
    import BigNumber from 'bignumber.js';
    import {
    AnyContract,
    Contract,
    ContractBase,
    TransactionOptions,
    TransactionResult,
    TruffleArtifacts
  } from 'truffle';

    namespace database {
    interface Migrations extends ContractBase {
      setCompleted(
        completed: number,
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      upgrade(
        address: Address,
        options?: TransactionOptions
      ): Promise<TransactionResult>;
    }

    interface MigrationsContract extends Contract<Migrations> {
        'new'(options?: TransactionOptions): Promise<Migrations>;
    }

    interface DatabaseBase extends ContractBase {
        registerAddress(
            addressToRegister: Address,
            options?: TransactionOptions
        ): Promise<TransactionResult>;

        deRegisterAddress(
            addressToDeRegister: Address,
            options?: TransactionOptions
        ): Promise<TransactionResult>;

        isAddressRegistered(
            addressToCheck: Address
        ): Promise<boolean>;

        getAllAddresses(): Promise<Address[]>;

        deRegisterAll(options?: TransactionOptions): Promise<TransactionResult>;

        getNextAddress(
            predecessorAddress: Address
        ): Promise<Address>;
    }

    interface DatabaseCallerBase extends ContractBase {
        collectData(
            databaseAddress: Address
        ): Promise<Address[]>;
    }

    interface DatabaseContract extends Contract<DatabaseBase> {
        'new'(
            options?: TransactionOptions
        ): Promise<DatabaseBase>;
    }

    interface DatabaseCallerContract extends Contract<DatabaseCallerBase> {
        'new'(
            options?: TransactionOptions
        ): Promise<DatabaseCallerBase>;
    }

    interface DepositReceiverBase extends ContractBase {
        deposit(options?: TransactionOptions): Promise<TransactionResult>;

        withdraw(
            ammount: BigNumber,
            options?: TransactionOptions
        ): Promise<TransactionResult>;

        getBalance(options?: TransactionOptions): Promise<BigNumber>;
    }

    interface DepositReceiverContract extends Contract<DepositReceiverBase> {
        'new'(
            databaseAddress: Address,
            options?: TransactionOptions
        ): Promise<DepositReceiverBase>;
    }

    interface DatabaseArtifacts extends TruffleArtifacts {
      require(name: string): AnyContract;
      require(name: './Migrations.sol'): MigrationsContract;
      require(name: './Database.sol'): DatabaseContract;
      require(name: './DatabaseCaller.sol'): DatabaseCallerContract;
      require(name: './DepositReceiver.sol'): DepositReceiverContract ;
    }
  }

    export = database;
}
