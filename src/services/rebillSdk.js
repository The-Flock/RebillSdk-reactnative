import Http from './http';

class RebillSdk {
  constructor(organizationId) {
    this.http = new Http(organizationId);
  }

  setCustomer = customer => {
    this.customer = customer;
  };

  setCardHolder = cardHolder => {
    this.cardHolder = cardHolder;
  };

  setTransaction = transaction => {
    this.transaction = transaction;
  };

  setElements = elements => {
    this.elements = elements;
  };

  setOrderId = orderId => {
    this.orderId = orderId;
  };

  setNumber = number => {
    this.number = number;
  };

  setCvc = cvc => {
    this.cvc = cvc;
  };

  setExpiry = expiry => {
    this.expiry = expiry;
  };

  setCallbacks = callbacks => {
    this.callbacks = callbacks;
  };

  setAlias = async alias => {
    this.alias = alias;
  };

  checkout = async () => {
    const rc = await this.http.get(`organization/alias/${this.alias}`);
    if (
      rc?.result?.compliance === false ||
      rc?.result?.compliance === undefined
    ) {
      this.callbacks.onError?.({
        code: 400,
        message: 'Missing compliance or false',
      });
      return;
    }
    const body = {
      customer: {
        ...this.customer,
        card: {
          cardHolder: this.cardHolder,
          cardNumber: this.number.replaceAll(' ', ''),
          securityCode: this.cvc,
          expiration: {
            month: this.expiry.split('/')[0],
            year: `${new Date().getFullYear().toString().substring(0, 2)}${
              this.expiry.split('/')[1]
            }`,
          },
        },
      },
      prices: this.transaction?.prices,
    };
    const r = await this.http.post('checkout', body);
    r.response.ok
      ? this.callbacks.onSuccess?.(r?.result)
      : this.callbacks.onError?.({
          code: r?.result?.statusCode,
          message: r?.result?.message,
        });
  };
  getPrices = async () => {
    const result = await Promise.all(
      this.transaction?.prices?.map(async i => {
        const r = await this.http.get(`item/price/${i.id}`);
        if (r.response.ok) {
          const total = Number(r.result.amount) * i.quantity;
          return {id: i.id, total};
        }
      }),
    );
    this.callbacks.onSuccessPrices(
      result.map(i => i.total).reduce((a, b) => a + b),
    );
  };
}

export default RebillSdk;
