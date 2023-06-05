import { playersApi } from '@/api/allEndpoints';
import usePreviousScreen from '@/hooks/usePreviousScreen';
import useScreenStore from '@/stores/screenStore';
import { DetailsRes } from '@/types/endpoints/players';
import { DownKeys, ForwardKeys, UpKeys } from '@/types/keys';
import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

export default function PlayersScreen() {
  const [cursorLoc, setCursor] = useState(0);
  const [players, setPlayers] = useState<DetailsRes[]>([]);
  usePreviousScreen('Menu');
  const { updateScreen, updatePlayer } = useScreenStore();

  useEffect(() => {
    async function getPlayerDetails() {
      const res = await playersApi.getAllPlayerDetails();
      setPlayers(res.data);
    }
    getPlayerDetails();
  }, []);

  function arrowHandler(event: KeyboardEvent) {
    if (UpKeys.includes(event.key) && cursorLoc > 0) {
      setCursor((cursorLoc) => cursorLoc - 1);
    }
    if (DownKeys.includes(event.key) && cursorLoc < players.length - 1) {
      setCursor((cursorLoc) => cursorLoc + 1);
    }
    if (ForwardKeys.includes(event.key)) {
      updatePlayer(players[cursorLoc]);
      updateScreen('SinglePlayer');
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowHandler);
    return () => {
      window.removeEventListener('keydown', arrowHandler);
    };
  });

  return (
    <div className='flex flex-wrap py-4 gap-4 w-full'>
      {players.map((player, i) => (
        <div
          onClick={() => {
            updatePlayer(players[players.indexOf(player)]);
            updateScreen('SinglePlayer');
          }}
          className='flex items-end h-8 text-xs w-32'
          key={player.id}
        >
          <div className='flex h-full items-center'>
            {cursorLoc === i ? <FaPlay /> : null}
          </div>
          <div className='flex h-12 min-w-[48px]'>
            <img
              src={`https://img.pokemondb.net/sprites/black-white/normal/${
                player.sprite || 'snorlax'
              }.png`}
            />
          </div>
          <span>
            {player.first_name} {player.last_name}
          </span>
        </div>
      ))}
    </div>
  );
}
