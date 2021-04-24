import { createContext, useState, ReactNode } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode; // tipagem do próprio react para informar que o tipo esperado é um elemento/tag do react
}

//desestruturação do props < para pegar apenas o children
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    
  // trabalhando co estados dentro de react
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]) // passando um episodio para lista
    setCurrentEpisodeIndex(0) // só forçar que volte pra zero.
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return(
    // sempre que quiser definir um contexto deve-se colocar esse componente dessa forma. (usando os tipos do obj definido no context)
    <PlayerContext.Provider 
        value={
                { 
                    episodeList,
                    currentEpisodeIndex,
                    play,
                    isPlaying,
                    togglePlay,
                    setPlayingState
            }
        }
    >
        {children}
    </PlayerContext.Provider>
  )
}