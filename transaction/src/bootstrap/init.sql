CREATE TABLE transactions
(
    transaction_external_id    UUID UNIQUE,
    account_external_id_debit  UUID           NOT NULL,
    account_external_id_credit UUID           NOT NULL,
    transfer_type_id           INTEGER        NOT NULL,
    value                      DECIMAL(15, 2) NOT NULL,
    status                     VARCHAR(20),
    created_at                 TIMESTAMP ,
    updated_at                 TIMESTAMP ,
);

CREATE INDEX transactions_external_id_idx ON transactions (transaction_external_id);
CREATE INDEX transactions_debit_account_idx ON transactions (account_external_id_debit);
CREATE INDEX transactions_status_idx ON transactions (status);
CREATE INDEX transactions_created_at_idx ON transactions (created_at DESC);
