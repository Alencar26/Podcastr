import { GetStaticProps } from 'next'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertionDurationToTimeString'

import styles from './home.module.scss'

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	description: string;
	url: string;
	duration: number;
	durationAsString: string;
}

type HomeProps = {
	latesEpisodes: Array<Episode> // ou Episode[];
	allEpisodes: Array<Episode>
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
		<section className={styles.latesEpisodes}>
			<h2>Últimos lançamentos</h2>

			<ul>
				{latesEpisodes.map(episode => {
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
								<a href="">{episode.title}</a>
								<p>{episode.members}</p>
								<span>{episode.publishedAt}</span>
								<span>{episode.durationAsString}</span>
							</div>

							<button type="button">
								<img src="/play-green.svg" alt="Tocar episódio"/>
							</button>
						</li>
					)
				})}
			</ul>
		</section>

		<section className={styles.allEpisodes}>

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
			description: episode.description,
			url: episode.file.url,
		}
	})

	const latesEpisodes = episodes.slice(0, 2); // da posição 0 me traga 2 episódios.
	const allEpisodes = episodes.slice(2, episodes.length); // a partir da posição 2 me traga o resto.

	return {
		props: { 
			latesEpisodes,
			allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	}
}