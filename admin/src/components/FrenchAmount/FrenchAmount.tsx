import React from 'react';
import { amountToFrench } from '../../utils/numberToFrench';

interface FrenchAmountProps {
  amount: number;
}

export const FrenchAmount: React.FC<FrenchAmountProps> = ({ amount }) => {
  const frenchText = amountToFrench(amount);

  return (
    <div>
      <p>Montant: {amount.toFixed(3)} €</p>
      <p>En toutes lettres: {frenchText}</p>
    </div>
  );
};

