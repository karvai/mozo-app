import React, { useState, useEffect } from 'react'
import Quagga from '@ericblade/quagga2'
import styled from 'styled-components'
import { upcitemdbAPI } from '../../api/upcitemDB'
import { withRouter } from 'react-router-dom'

export const ContentWrapper = styled.div`
	p {
		font-size: 12px;
		position: fixed;
		top: 0%;
		z-index: 1;
		text-align: center;
		padding: 20px;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
	}
	.notFound {
		font-size: 18px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	#interactive {
		video {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			min-width: 100%;
			min-height: 100%;
		}
		canvas {
			display: none;
		}
	}
`

const dictionary = ['<region 2 Dvd, Sealed>', '<region 1 Dvd, Sealed>', '4k Ultra Hd', '(DVD + Ultraviolet Digital Copy)', '<region A Bluray, Sealed>', '<region B Bluray, Sealed>']

const filterUsingDict = (word, dic) => {
	let newWord = ''
	dic.forEach((item) => {
		newWord = word.toLowerCase().replace(item.toLowerCase(), '')
	})
	return newWord.trim()
}

const orderOccurrence = (arr) => {
	let duplicates = {}
	let max = ''
	let maxi = 0
	arr.forEach((el) => {
		duplicates[el] = duplicates[el] + 1 || 1
		if (maxi < duplicates[el]) {
			max = el
			maxi = duplicates[el]
		}
	})
	return max
}

function ScanPage({ searchHandler, history }) {
	const [isCameraAvailable, setCameraAvailable] = useState(true)
	const [barcode, setBarcode] = useState()
	const [movieTitle, setMovieTitle] = useState()
	const [scanAgainToggle, setScanAgainToggle] = useState()
	const [backCamera, setBackCamera] = useState([])
	const [errorMessage, setErrorMessage] = useState(false)

	useEffect(() => {
		//// camera is not enabled
		!!navigator.getUserMedia &&
			navigator.getUserMedia(
				{ video: true },
				() => {
					setCameraAvailable(true)

					navigator.mediaDevices
						.enumerateDevices()
						.then((devices) => {
							devices.forEach((device) => {
								if (device.kind === 'videoinput' && device.label.toLowerCase().includes('back')) {
									setBackCamera((prev) => [...prev, device.deviceId])
								}
							})
						})
						.catch((err) => {
							alert(console.log(err.message))
						})

					Quagga.init(
						{
							inputStream: {
								type: 'LiveStream',
								constraints: {
									facingMode: 'environment',
									deviceId: backCamera[backCamera.length - 1],
								},
							},
							locator: {
								patchSize: 'medium',
								halfSample: true,
							},
							numOfWorkers: navigator.hardwareConcurrency,
							decoder: {
								readers: ['ean_reader', 'upc_reader'],
							},
						},
						(err) => {
							!!err && console.warn(err)
							Quagga.start()
						}
					)
					let collectionResults = []
					Quagga.onDetected((e) => {
						collectionResults.push(e.codeResult.code)
						if (collectionResults.length > 10) {
							setBarcode(orderOccurrence(collectionResults))
							collectionResults = []
							Quagga.stop()
						}
					})
				},
				// camera is not enabled
				() => {
					setCameraAvailable(false)
				}
			)
		// when unmounted stop quagga
		return () => Quagga.stop()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scanAgainToggle])

	useEffect(() => {
		!!barcode &&
			upcitemdbAPI
				.getMovieNameByBarcode(barcode)
				.then((data) => {
					!!data && !!data.items[0].title && setMovieTitle(filterUsingDict(data.items[0].title, dictionary))
				})
				.catch((e) => {
					setErrorMessage(true)
					setTimeout(() => {
						setScanAgainToggle((prev) => !prev)
						setErrorMessage(false)
					}, 1500)
					setBarcode()
				})
	}, [barcode])

	if (!!movieTitle) {
		searchHandler(movieTitle)
		history.push('/')
	}

	return (
		<ContentWrapper>
			{isCameraAvailable ? <p>Point your camera at a barcode and avoid glare and shadows</p> : <p>You need to allow camera in your browser to scan the barcode</p>}
			<div id='interactive' className='viewport' />
			{!!errorMessage && <p className='notFound'>Couldn't find this movie in database</p>}
		</ContentWrapper>
	)
}

export default withRouter(ScanPage)
