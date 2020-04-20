<template>
	<view class="page" >
		<view class="top">
			<image class="login-icon" src="/static/images/my/mine_def_touxiang_3x.png" mode=""></image>
			<view class="login-bg"></view>
		</view>
		<view class="body">
			<form @submit="promiseLogin" >
				<view class="info" v-for="(item, index) in login_list" :key="item.key">
					<image class="info-icon" :src="item.icon" mode=""></image>
					<input class="input-text" :name="item.key" :data-key="item.key" :focus="item.focus" :type="item.type" :placeholder="item.title" />
				</view>
				<!-- 登录按钮 -->
				<button class="login-btn" form-type="submit">登录</button>
				<view class="psw-tip">忘记密码?</view>

				<!-- 切换 -->
				<view class="buttom-tip">
					<view class="text">
						没有帐号?
					</view>
					<view class="tip-high" @tap="tapToRegister">
						注册
					</view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import tuiIcon from "@/components/icon/icon"
	import tuiButton from "@/components/button/button"
	const util = require('../../utils/util.js')
	let Oauth2 = require('../../utils/weeshop_lib/api/oauth2.js')
	
	export default {
		components: {
			tuiIcon,
			tuiButton
		},
		data() {
			return {
				//静态输入框数据
				login_list: [
					{ key: 'account', title: '请输入帐号', icon: '/static/images/login/email.png', focus: true, type: 'text' ,show_right: false,},
					{ key: 'pasw', title: '请输入密码', icon: '/static/images/login/password.png', focus: false, type: 'text' ,show_right: false,}
				],
			}
		},
		methods: {
			...mapMutations(['login']),
			//切换注册页面
			tapToRegister() {
				uni.navigateTo({
					url:"../register/register"
				})
			},
			
			//登录按钮
			promiseLogin(e) {
				var form_data = e.detail.value; //表单数据
				// 用户名、邮箱或手机号 + 密码登录
				let passwordLogin = new Oauth2.CreateTokenByPasswordImproved(form_data.account, form_data.pasw)
				this.loginPromiseResolve(passwordLogin) // 使用手机短信验证码登录
				
				// // 手机短信验证码登录
				// const country = 'CN'
				// const number = '15999643270'
				// const code = '666666'
				// let smsLogin = new Oauth2.CreateTokenBySMS(country, number, code)
				// this.loginPromiseResolve(smsLogin) // 使用手机短信验证码登录
				// console.log(this.loginPromiseResolve);
			},
			
		}
	}
</script>

<style>
	.page{
		width: 750rpx;
		height: 100%;
		position: relative;
		text-align: center;
	}
	
	
	
	/* 顶部样式 */
	.page .top{
		height: 500rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top .login-icon{
		width: 150rpx;
		height: 150rpx;
		z-index: 1;
		padding-bottom: 50rpx;
	}
	
	.top .login-bg{
		z-index: 0;
		background-color: #ef315b;
		/* background: linear-gradient(to bottom, #ef315b,#ef315b,#ef315b, #f27c72); */
		width: 100%;
		height: 500rpx;
		border-bottom-left-radius: 160rpx;
		position: absolute;
		top: 0;
		left: 0;
	}
	
	/* body样式 */
	.body{
		margin-top: 100rpx;
		width: 640rpx;
		margin-left: auto;
		margin-right: auto;
	}
	
	.body .info{
		/* width: 100%; */
		box-shadow: 0rpx 5rpx 12rpx #a9a9a9;
		border-radius: 30rpx;
		display: flex;
		flex-direction: row;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 10rpx;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.body .info :last-child{
		margin-bottom: 0rpx;
	}
	
	.info .info-icon{
		width: 40rpx;
		height: 40rpx;
		margin: 0 30rpx;
	}
	
	.info .input-text{
		font-size: 30rpx;
		text-align: start;
		flex: 1;
		margin-right: 30rpx;
	}
	
	.info .code-btn{
		height: 100%;
		font-size: 18rpx;
		margin-right: 10rpx;
		font-weight: 400;
	}
	
	.code-btn-color{
		color: #a9a9a9;
	}
	
	.body .psw-tip{
		color: #a9a9a9;
		font-size: 18rpx;
		margin-top: 20rpx;
		text-align: end;
	}
	
	.body .login-btn{
		width: 100%;
		background: linear-gradient(to left, #ef315b, #ef315b,#ef315b, #f27c72);
		height: 70rpx;
		line-height: 70rpx;
		font-size: 32rpx;
		text-align: center;
		border-radius: 30rpx;
		margin-top: 150rpx;
		color: #FFFFFF;
		letter-spacing: 10rpx;
	}
	
	.page .buttom-tip{
		color: #a9a9a9;
		font-size: 18rpx;
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 120rpx;
		left: 50%;
		transform: translate(-50%, 0);
		
	}
	
	.buttom-tip .text{
		margin-right: 10rpx;
	}
	
	.buttom-tip .tip-high{
		color: #ef315b;
		border: none;
		margin: 0;
		padding: 0;
		font-size: 18rpx;
	}
</style>
