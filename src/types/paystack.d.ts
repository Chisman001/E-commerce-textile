declare module "@paystack/inline-js" {
  interface CustomField {
    display_name: string;
    variable_name: string;
    value: string;
  }

  interface TransactionMetadata {
    custom_fields?: CustomField[];
    [key: string]: unknown;
  }

  interface TransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: TransactionMetadata;
    onSuccess?: (transaction: { reference: string; trans: string; status: string }) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
  }

  class PaystackPop {
    newTransaction(options: TransactionOptions): void;
    cancelTransaction(): void;
  }

  export default PaystackPop;
}
