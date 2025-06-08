const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
const scales = ['', 'mille', 'million', 'milliard', 'billion', 'billiard'];

function convertLessThanOneThousand(number: number): string {
  if (number === 0) {
    return '';
  }

  let result = '';

  if (number >= 100) {
    result += units[Math.floor(number / 100)] + ' cent ';
    number %= 100;
    if (number === 0 && result !== 'un cent ') {
      result += 's ';
    }
  }

  if (number >= 20) {
    const tenIndex = Math.floor(number / 10);
    result += tens[tenIndex];
    if (number % 10 !== 0) {
      result += '-' + units[number % 10];
    }
  } else if (number >= 10) {
    result += teens[number - 10];
  } else if (number > 0) {
    result += units[number];
  }

  return result.trim();
}

export function numberToFrench(number: number): string {
  if (number === 0) {
    return 'zéro';
  }

  let result = '';
  let scaleIndex = 0;

  while (number > 0) {
    if (number % 1000 !== 0) {
      const words = convertLessThanOneThousand(number % 1000);
      if (scaleIndex > 0) {
        result = words + ' ' + scales[scaleIndex] + ' ' + result;
      } else {
        result = words + ' ' + result;
      }
    }
    number = Math.floor(number / 1000);
    scaleIndex++;
  }

  return result.trim();
}

export function amountToFrench(amount: number): string {
  const euros = Math.floor(amount);
  const cents = Math.round((amount - euros) * 100);

  let result = numberToFrench(euros) + ' euro' + (euros > 1 ? 's' : '');

  if (cents > 0) {
    result += ' et ' + numberToFrench(cents) + ' centime' + (cents > 1 ? 's' : '');
  }

  return result;
}

