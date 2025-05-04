import { useState, useEffect } from 'react';

export const useInsurance = ({
  dealerHands,
  onAcceptInsurance,
  onDeclineInsurance,
}: {
  dealerHands: any[];
  onAcceptInsurance: () => void;
  onDeclineInsurance: () => void;
}) => {
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  useEffect(() => {
    // 只在庄家发第一张牌后触发
    if (dealerHands.length === 1 && dealerHands[0]?.rank === 'ace') {
        setTimeout(()=>{
            setShowInsuranceModal(true);
        },4500)

    }
  }, [dealerHands]);

  const handleAcceptInsurance = () => {
    setShowInsuranceModal(false);
    onAcceptInsurance();
  };

  const handleDeclineInsurance = () => {
    setShowInsuranceModal(false);
    onDeclineInsurance();
  };

  return {
    showInsuranceModal,
    handleAcceptInsurance,
    handleDeclineInsurance,
  };
};
