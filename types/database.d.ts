declare module 'database' {
  import { BigNumber } from 'bignumber.js';
  import {
    AnyContract,
    Contract,
    ContractBase,
    TransactionOptions,
    TransactionResult,
    TruffleArtifacts
  } from 'truffle';
  import { AnyNumber } from 'web3';

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

    interface DatabaseContract {
        'new'( options?: TransactionOptions ): Promise<DatabaseContract>;
    }

    interface DatabaseArtifacts extends TruffleArtifacts {
      require(name: string): AnyContract;
      require(name: './Migrations.sol'): MigrationsContract;
      require(name: './Database.sol'): DatabaseContract;
    }
  }

  export = database;
}
