import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/playerContext';

import style from './styles.module.scss';

export function Player() {

    //useRef usado para manipular elementos nativos do HTML
    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious
    } = useContext(PlayerContext)

    //função de efeito colateral. (essa função dispara toda vez que o isPlaying tem seu valor alterado)
    useEffect(() => {

        if (!audioRef.current) return;
            
        if (isPlaying) audioRef.current.play();
            
        else audioRef.current.pause();
            
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return(
        <div className={style.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={style.currentEpisode}>
                    <Image  
                        width={592}
                        height={592} 
                        src={episode.thumbnail} 
						objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={style.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? style.empty : ''}>
                <div className={style.progress}>
                    <span>00:00</span>
                    <div className={style.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            /> 
                        ) : (
                            <div className={style.emptySlider} />
                        ) }
                    </div>
                    <span>00:00</span>
                </div>
                
                {/*validação if que não precisa do else*/}
                { episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        autoPlay
                    />
                ) }

                <div className={style.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={style.playButton} disabled={!episode} onClick={togglePlay}>
                        { isPlaying ? 
                            <img src="/pause.svg" alt="Pausar"/>
                            :
                            <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}