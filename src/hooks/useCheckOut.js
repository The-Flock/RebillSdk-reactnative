const useCheckOut = () => {
    const checkout = async rebillSdk => {
      const body = {
        customer: {
          ...rebillSdk.customer,
          card: {
            cardHolder: rebillSdk.cardHolder,
            cardNumber: rebillSdk.number.replaceAll(' ', ''),
            securityCode: rebillSdk.cvc,
            expiration: {
              month: rebillSdk.expiry.split('/')[0],
              year: `${new Date().getFullYear().toString().substring(0, 2)}${
                rebillSdk.expiry.split('/')[1]
              }`,
            },
          },
        },
        prices: rebillSdk.transaction?.prices,
      };
      const r = await rebillSdk.http.post('checkout', body);
      r.response.ok
        ? rebillSdk.callbacks.onSuccess?.(r?.result)
        : rebillSdk.callbacks.onError?.({
            code: r?.result?.statusCode,
            message: r?.result?.message,
          });
    };
    return checkout;
  };
  
  export default useCheckOut;