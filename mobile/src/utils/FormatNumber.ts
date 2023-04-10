export function FormatNumber(amount: any){    
       
  if (typeof amount === 'number') {
    const [currency, cents] = (amount / 100).toFixed(2).toString().split('.');
    return `${currency.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${cents}`;
  }

  return '0,00';
}


