import Axios from 'axios'

const apiKey = '1ad0f806'

const instance = Axios.create({
	baseURL: 'https://www.omdbapi.com',
})

export const omdbAPI = {
	getMovieByIMDB(id) {
		return instance.get(`?apikey=${apiKey}&i=${id}`).then((response) => response.data)
	},
}
