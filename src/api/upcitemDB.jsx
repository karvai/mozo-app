import Axios from 'axios'

const instance = Axios.create({
	baseURL: 'https://cors-anywhere.herokuapp.com/https://api.upcitemdb.com/prod/trial',
})

export const upcitemdbAPI = {
	getMovieNameByBarcode(barcode) {
		return instance.get(`lookup?upc=${barcode}`).then((response) => response.data)
	},
}
