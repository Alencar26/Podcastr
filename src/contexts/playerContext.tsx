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
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
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
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]) // passando um episodio para lista
    setCurrentEpisodeIndex(0) // só forçar que volte pra zero.
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext)
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  function playPrevious() {
    if(hasPrevious)
        setCurrentEpisodeIndex(currentEpisodeIndex - 1) 
  }

  return(
    // sempre que quiser definir um contexto deve-se colocar esse componente dessa forma. (usando os tipos do obj definido no context)
    <PlayerContext.Provider 
        value={
                { 
                    episodeList,
                    currentEpisodeIndex,
                    play,
                    playList,
                    playNext,
                    playPrevious,
                    isPlaying,
                    isLooping,
                    isShuffling,
                    togglePlay,
                    setPlayingState,
                    hasNext,
                    hasPrevious,
                    toggleLoop,
                    toggleShuffle
            }
        }
    >
        {children}
    </PlayerContext.Provider>
  )
}