import Axios from 'axios'

const instance = Axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.0/',
	withCredentials: true,
	headers: { 'API-KEY': 'fd4c9a34-b6e7-42d4-b18c-b0f9a24fd2d9' },
})

export const usersAPI = {
	getUsers(currentPage, pageSize) {
		return instance.get(`users?page=${currentPage}&count=${pageSize}`).then((response) => response.data)
	},

	follow(userId) {
		return instance.post(`follow/${userId}`)
	},

	unfollow(userId) {
		return instance.delete(`follow/${userId}`)
	},

	getProfile(userId) {
		return instance.get(`profile/${!userId ? 2 : userId}`).then((response) => response.data)
	},
}

export const authAPI = {
	me() {
		return instance.get(`auth/me`).then((response) => response.data)
	},
}
