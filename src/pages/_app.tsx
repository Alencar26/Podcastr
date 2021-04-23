import '../styles/global.scss'

import { Header } from '../components/Header/Index'
import { Player } from '../components/Player/Index'
import { PlayerContext } from '../contexts/playerContext'

import style from '../styles/app.module.scss'
import { useState } from 'react'


function MyApp({ Component, pageProps }) {

  // trabalhando co estados dentro de react
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  function play(episode) {
    setEpisodeList([episode]) // passando um episodio para lista
    setCurrentEpisodeIndex(0) // só forçar que volte pra zero.
  } 

  return(
    // sempre que quiser definir um contexto deve-se colocar esse componente dessa forma. (usando os tipos do obj definido no context)
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}>
      <div className={style.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
