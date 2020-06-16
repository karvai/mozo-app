import React, { useState, useEffect } from 'react'
import Quagga from '@ericblade/quagga2'
import styled from 'styled-components'
import { upcitemdbAPI } from '../../api/upcitemDB'
import { withRouter } from 'react-router-dom'

export const ContentWrapper = styled.div`
	overflow: visible;
	p {
		font-size: 12px;
		position: fixed;
		bottom: 61px;
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
	select {
		position: fixed;
		padding: 5px;
		border-radius: 5px;
		left: 50%;
		top: 30px;
		transform: translate(-50%, 0);
		z-index: 2;
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
	}
`

const dictionary = ['(uk Import)', '<region 2 Dvd, Sealed>', '<region 1 Dvd, Sealed>', '4k Ultra Hd', '(DVD + Ultraviolet Digital Copy)', '<region A Bluray, Sealed>', 'Blu-ray', '<region B Bluray, Sealed>', 'Standard Definition', 'Widescreen', 'Blu-ray+DVD', ', Movies', 'by Warner Brothers', 'Warner Bros.', '(Bilingual) Yes', 'Extended Cut', 'with UltraViolet', '+ Digital HD', 'Walmart Exclusive', '4K Ultra HD', 'Includes Digital Copy', '[UltraViolet]', 'DVD', 'Digital Copy', '[SteelBook]', 'Only @ Best Buy', '()', '[]']

const filterUsingDict = (word, dic) => {
	dic.forEach((w) => (word = word.replace(w, '')))
	return word.trim()
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
	const [scanAgainToggle, setScanAgainToggle] = useState()
	const [camAvailable, setCamAvailable] = useState([])
	const [currentCamera, setCurrentCamera] = useState(localStorage.getItem('currentCamera') || '')
	const [errorMessage, setErrorMessage] = useState(false)

	useEffect(() => {
		!!navigator.getUserMedia &&
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					devices.forEach((device) => {
						if (device.kind === 'videoinput') {
							setCamAvailable((prev) => [...prev, device.deviceId])
						}
					})
				})
				.catch((err) => {
					alert(console.log(err.message))
				})
	}, [])

	useEffect(() => {
		localStorage.setItem('currentCamera', currentCamera)
	}, [currentCamera])

	useEffect(() => {
		!!navigator.getUserMedia &&
			navigator.getUserMedia(
				{ video: true },
				() => {
					setCameraAvailable(true)
					Quagga.init(
						{
							inputStream: {
								type: 'LiveStream',
								constraints: {
									facingMode: 'environment',
									deviceId: currentCamera,
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
							if (err) {
								console.log(err)
								return
							}
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
	}, [scanAgainToggle, currentCamera])

	useEffect(() => {
		!!barcode &&
			upcitemdbAPI
				.getMovieNameByBarcode(barcode)
				.then((data) => {
					if (!!data && !!data.items[0].title) {
						searchHandler(filterUsingDict(data.items[0].title, dictionary))
						history.push('/')
					}
				})
				.catch((e) => {
					setErrorMessage(true)
					setTimeout(() => {
						setScanAgainToggle((prev) => !prev)
						setErrorMessage(false)
					}, 1500)
					setBarcode()
				})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [barcode])

	return (
		<ContentWrapper>
			<select onChange={(e) => setCurrentCamera(e.target.value)} value={currentCamera}>
				{camAvailable.map((item, index) => (
					<option key={item} value={item}>
						Camera {index + 1}
					</option>
				))}
			</select>
			<div id='interactive' className='viewport' />
			{!!errorMessage && <p className='notFound'>Couldn't find this movie in database</p>}
			{isCameraAvailable ? <p>Point your camera at a barcode and avoid glare and shadows </p> : <p>You need to allow camera in your browser to scan the barcode</p>}
		</ContentWrapper>
	)
}

export default withRouter(ScanPage)
