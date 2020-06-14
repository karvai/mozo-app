import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const base = firebase.initializeApp({
	apiKey: 'AIzaSyCob3JUekbn-gXehrzxNY1uPOAbYVoUNsQ',
	authDomain: 'mozo-a0d17.firebaseapp.com',
	databaseURL: 'https://mozo-a0d17.firebaseio.com',
	projectId: 'mozo-a0d17',
	storageBucket: 'mozo-a0d17.appspot.com',
	messagingSenderId: '34992352504',
	appId: '1:34992352504:web:3149613eeb9eecb8ee1f0d',
	measurementId: 'G-W787VFY9S5',
})

export default base
