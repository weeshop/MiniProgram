import Vue from 'vue'
import App from './App'
import RequestUniApp from 'utils/weeshop_lib/UniApp/RequestUniApp.js'
import APIManager from 'utils/weeshop_lib/APIManager.js'
import SessionManagerOauth2UniApp from 'utils/weeshop_lib/UniApp/SessionManagerOauth2UniApp.js'
let Oauth2 = require('./utils/weeshop_lib/api/oauth2.js')

Vue.config.productionTip = false

const tui = {
	toast: function(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	constNum: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android" ? 300 : 0;
	},
	px: function(num) {
		return uni.upx2px(num) + 'px';
	},
	interfaceUrl: function() {
		//接口地址
		return "https://www.thorui.cn";
	},
	request: function(url, postData, method, type, hideLoading) {
		//接口请求
		if (!hideLoading) {
			uni.showLoading({
				mask: true,
				title: '请稍候...'
			})
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: this.interfaceUrl() + url,
				data: postData,
				header: {
					'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
					'authorization': this.getToken(),
					'security': 1
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					!hideLoading && uni.hideLoading()
					resolve(res.data)
				},
				fail: (res) => {
					if (!hideLoading) {
						this.toast("网络不给力，请稍后再试~")
					}
					reject(res)
				}
			})
		})
	},
	uploadFile: function(src) {
		const that = this
		uni.showLoading({
			title: '请稍候...'
		})
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: 'https://abc.cc',
				filePath: src,
				name: 'file',
				header: {
					'content-type': 'multipart/form-data'
				},
				formData: {},
				success: function(res) {
					uni.hideLoading()
					let d = JSON.parse(res.data)
					if (d.code === 1) {
						let fileObj = JSON.parse(d.data)[0];
						//文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
						resolve(fileObj)
					} else {
						that.toast(res.message);
					}
				},
				fail: function(res) {
					reject(res)
					uni.hideLoading();
					that.toast(res.message);
				}
			})
		})
	},
	setToken: function(token) {
		uni.setStorageSync("token", token)
	},
	getToken() {
		return uni.getStorageSync("token")
	},
	isLogin: function() {
		return uni.getStorageSync("token") ? true : false
	},
	webURL:function(){
		return "https://www.thorui.cn/wx"
	}
}

let request = new RequestUniApp(
	(res) => {
		console.log('请求成功！')
		return new Promise((resolve, reject) => {
			resolve(res)
		})
	},
	(err) => {
		console.log('请求失败！')
		return new Promise((resolve, reject) => {
			resolve()
		})
	})

// 初始化 APIManager
let apiManager = new APIManager(request,
	(err) => {
		console.log('重试失败！')
	}
)

// 让 APIManager 支持会话
let sessionManager = new SessionManagerOauth2UniApp(
  apiManager,
	() => {
		console.log('引导登录！')
		return new Promise((resolve, reject) => {
			// 登录凭证可以通过弹窗让用户输入
			
			// 用户名、邮箱或手机号 + 密码登录
			const username = '164713332@qq.com'
			const password = '123'
			// resolve(new Oauth2.CreateTokenByPasswordImproved(username, password))
			
			// 手机短信验证码登录
			const country = 'CN'
			const number = '15999643270'
			const code = '666666'
			resolve(new Oauth2.CreateTokenBySMS(country, number, code))
		})
	},
	() => {
		console.log('会话已创建！')
		return new Promise((resolve, reject) => {
			resolve()
		})
	},
)

Vue.prototype.APIManager = apiManager


Vue.prototype.tui = tui
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
