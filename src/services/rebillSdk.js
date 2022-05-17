import Http from './http';

class RebillSdk {
  constructor(
    organizationId,
    customer,
    cardHolder,
    transaction,
    elements,
    orderId,
    number,
    cvc,
    expiry,
    callbacks,
  ) {
    this.http = new Http(organizationId);
    this.customer = customer;
    this.cardHolder = cardHolder;
    this.transaction = transaction;
    this.elements = elements;
    this.orderId = orderId;
    this.number = number;
    this.cvc = cvc;
    this.expiry = expiry;
    this.callbacks = callbacks;
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

  checkout = async () => {
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
