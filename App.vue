<script>
	let User = require('./utils/weeshop_lib/api/user.js')
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			let api_userinfo = new User.UserInfo()
			this.APIManager.exec(api_userinfo).then(res => {
				console.log(res)
			})
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/app.css";
</style>
