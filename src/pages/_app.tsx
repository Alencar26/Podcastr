import React from 'react'

import { Header } from '../components/Header/Index'
import { Player } from '../components/Player/Index'

import { PlayerContextProvider } from '../contexts/playerContext'

import '../styles/global.scss'
import style from '../styles/app.module.scss'


function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      <div className={style.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
