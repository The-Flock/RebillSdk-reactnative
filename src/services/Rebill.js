import HttpServices from './HttpServices';

const Rebill = organization_id => {
  const {get, post} = HttpServices(organization_id);
  const checkout = async body => await post('checkout', body);
  const getPrices = async priceId => await get(`item/price/${priceId}`);
  return {checkout, getPrices};
};

export default Rebill;
