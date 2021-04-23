import Image from 'next/image';
import { useContext } from 'react';

import { PlayerContext } from '../../contexts/playerContext';

import style from './styles.module.scss';

export function Player() {

    const { episodeList, currentEpisodeIndex } = useContext(PlayerContext)

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
                        <div className={style.emptySlider} />
                    </div>
                    <span>00:00</span>
                </div>

                <div className={style.buttons}>
                    <button type="button">
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button">
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={style.playButton}>
                        <img src="/play.svg" alt="Tocar"/>
                    </button>
                    <button type="button">
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button">
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}