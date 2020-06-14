// converts minutes to hours and minutes, example: 5min -> 5min / 120min -> 2h / 63min -> 1h 3min
export const timeConvert = (min) => {
	const hours = Math.floor(min / 60)
	const minutes = min % 60
	return hours !== 0 ? (minutes !== 0 ? `${hours} h ${minutes} min` : `${hours} h`) : `${minutes} min`
}

// formats date, example: 2019-05-30 -> 30 May 2019
export const formatDate = (date) => {
	return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// gets fist and last word from the sentence, example: Leytonstone, London, England, UK -> Leytonstone, UK
export const getFirstLastWord = (sentence) => {
	if (sentence.includes(' - ')) {
		const arr = sentence.split(' - ')
		return `${arr[0]}, ${arr[arr.length - 1] === 'U.S.' ? 'USA' : arr[arr.length - 1]}`
	} else if (sentence.includes(',')) {
		const arr = sentence.split(', ')
		return `${arr[0]}, ${arr[arr.length - 1] === 'U.S.' ? 'USA' : arr[arr.length - 1]}`
	} else {
		return sentence
	}
}
