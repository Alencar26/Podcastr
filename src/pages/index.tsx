import { useContext } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertionDurationToTimeString'
import { PlayerContext } from '../contexts/playerContext'

import styles from './home.module.scss'

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	url: string;
	duration: number;
	durationAsString: string;
}

type HomeProps = {
	latestEpisodes: Array<Episode> // ou Episode[];
	allEpisodes: Array<Episode>
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  	const { playList } = useContext(PlayerContext)

	const episodeList = [...latestEpisodes, ...allEpisodes]

	return (
		<div className={styles.homepage}>
			<Head>
				<title>Home | Podcastr</title>
			</Head>

			<section className={styles.latesEpisodes}>
				<h2>Últimos lançamentos</h2>

				<ul>
					{latestEpisodes.map((episode, index) => {
						return(
							<li key={episode.id}>
								<Image
									width={192} 
									height={192} 
									src={episode.thumbnail} 
									alt={episode.title}
									objectFit="cover"
								/>

								<div className={styles.episodeDetails}>
									<Link href={`/episode/${episode.id}`}>
										<a>{episode.title}</a>
									</Link>
									<p>{episode.members}</p>
									<span>{episode.publishedAt}</span>
									<span>{episode.durationAsString}</span>
								</div>

								{/*dentro de REACT sempre que for usar o onclick deve-se passar um função que retorna uma função*/}
								<button type="button" onClick={() => playList(episodeList, index)}>
									<img src="/play-green.svg" alt="Tocar episódio"/>
								</button>
							</li>
						)
					})}
				</ul>
			</section>

			<section className={styles.allEpisodes}>
				<h2>Todos episódios</h2>

				<table cellSpacing={0}>
					<thead>
						<tr>
							<th></th>
							<th>Podcast</th>
							<th>Integrantes</th>
							<th>Data</th>
							<th>Duração</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{allEpisodes.map((episode, index) => {
							return (
								<tr key={episode.id}>
									<td style={{ width: 72 }}>
										<Image 
											width={120} 
											height={120} 
											src={episode.thumbnail} 
											alt={episode.title} 
											objectFit="cover" 
										/>
									</td>
									<td>
										<Link href={`/episode/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
									</td>
									<td>{episode.members}</td>
									<td style={{ width: 100 }}>{episode.publishedAt}</td>
									<td>{episode.durationAsString}</td>
									<td>
										<button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
											<img src="/play-green.svg" alt="Tocar episódio"/>
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</section>
		</div>
	)
}

//SSG <-- requisição para o servidor. (de forma stática feita pelo NEXT)
export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc'
		}
	})

	const episodes = data.map(episode => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
			url: episode.file.url,
		}
	})

	const latestEpisodes = episodes.slice(0, 2); // da posição 0 me traga 2 episódios.
	const allEpisodes = episodes.slice(2, episodes.length); // a partir da posição 2 me traga o resto.

	return {
		props: { 
			latestEpisodes,
			allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	}
}