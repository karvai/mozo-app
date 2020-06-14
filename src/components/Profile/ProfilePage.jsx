import React from 'react'
import { Redirect } from 'react-router-dom'
import base from '../../api/firebase'

export default function ProfilePage({ currentUser }) {
	if (!currentUser) {
		return <Redirect to='/profile/login' />
	}

	return (
		<div>
			Profile
			<button onClick={() => base.auth().signOut()}>Sign Out</button>
		</div>
	)
}
