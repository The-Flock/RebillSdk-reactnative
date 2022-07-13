# react-native-flock-module

Module card for payments

## Installation

```sh
npm install @the-flock/sdk-reactnative
```

## Usage

```js

import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, Text, Button} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CreditCardInput, RebillSdk} from '@the-flock/sdk-reactnative';

const organizationId = '371c1f28-9a66-4d85-9bc5-b6e8dd433e94';
const customer = {
  firstName: 'Jose',
  lastName: 'Sanchez',
  email: 'jose@jose.com',
  personalId: {
    type: 'DNI',
    value: '38617261',
  },
  phone: {
    countryCode: '54',
    areaCode: '11',
    phoneNumber: '26423002',
  },
  address: {
    country: 'AR',
    street: 'Arenales',
    number: '554',
    zipCode: '1638',
    city: 'Vicente Lopez',
    state: 'Buenos Aires',
  },
};
const cardHolder = {
  identification: {
    type: 'DNI',
    value: '35094310',
  },
  name: 'EZEQUIEL',
};
const transaction = {
  prices: [
    {
      id: '7fdc6cc5-7b4c-4e6c-9ff2-624edc8ae485',
      quantity: 2,
    },
  ],
};
const defaultValues = {
  number: '4509953566233704',
  expiry: '11/25',
  cvc: '123',
};

const App = () => {
  const [checkoutInProcess, setCheckoutInProcess] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [price, setPrice] = useState(0);
  const checkout = new RebillSdk(organizationId);
  checkout.setCustomer(customer);
  checkout.setCardHolder(cardHolder);
  checkout.setTransaction(transaction);
  checkout.setElements('@the-flock/sdk-reactnative');
  checkout.setCallbacks({
    onSuccessPrices: p => setPrice(p),
    onSuccess: r => setResult(r),
    onError: e => setError(e),
  });
  checkout.setAlias('santitest2');

  useEffect(() => {
    checkout.getPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (checkoutInProcess) {
      setResult();
      setError();
    }
  }, [checkoutInProcess]);

  const handleOnPressCheckout = async () => {
    setCheckoutInProcess(true);
    await checkout.checkout();
    setCheckoutInProcess(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Button title="Ejecutar checkout" onPress={handleOnPressCheckout} />
      <CreditCardInput
        defaultValues={defaultValues}
        rebillSdk={checkout}
        onCheckoutInProcess={setCheckoutInProcess}
        validColor="black"
        invalidColor="red"
        placeholderColor="darkgray"
        onPay={card => console.log(card)}
      />

      {checkoutInProcess ? <ActivityIndicator /> : <Text>{`${price}`}</Text>}
      {result && <Text>{`Result: ${JSON.stringify(result)}`}</Text>}
      {error && <Text>{`Error: ${JSON.stringify(error)}`}</Text>}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {marginHorizontal: 12, marginVertical: 16},
});

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
