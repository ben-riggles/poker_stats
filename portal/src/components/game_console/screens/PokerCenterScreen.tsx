import useScreenStore from '@/stores/screenStore';

export default function PokerCenterScreen() {
  const { updateScreen } = useScreenStore();
  return (
    <div>
      <div>Poker Center</div>
      <div className='cursor-pointer' onClick={() => updateScreen('Welcome')}>
        Back
      </div>
    </div>
  );
}
