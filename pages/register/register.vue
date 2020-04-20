<template>
	<view class="page" >
		<view class="top">
			<image class="login-icon" src="/static/images/my/mine_def_touxiang_3x.png" mode=""></image>
			<view class="login-bg"></view>
		</view>
		<view class="body">
			<form @submit="promiseLogin" >
				<view class="info" v-for="(item, index) in register_list" :key="item.key">
					<image class="info-icon" :src="item.icon" mode=""></image>
					<input class="input-text" :name="item.key" :data-key="item.key" :focus="item.focus" @input="inputPhone" :type="item.type" :placeholder="item.title" />
					<view class="code-btn" :class="timeColor" v-show="item.show_right" @tap="btnSend">{{ btnText }}</view>
				</view>
				<!-- 登录按钮 -->
				<button class="login-btn" form-type="submit">注册</button>

				<!-- 切换 -->
				<view class="buttom-tip">
					<view class="text">
						已有帐号?
					</view>
					<view class="tip-high" @tap="tapToLogin">
						登录
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
				register_list: [
					{ key: 'name', title: '用户名', icon: '/static/images/login/user.png', focus: true, type: 'text' , show_right: false,},
					{ key: 'email', title: '邮箱', icon: '/static/images/login/email.png', focus: false, type: 'text' ,show_right: false,},
					{ key: 'phone', title: '手机号码', icon: '/static/images/login/phone.png', focus: false, type: 'number' ,show_right: false,},
					{ key: 'code', title: '输入验证码', icon: '/static/images/login/code.png', focus: false, type: 'number' ,show_right: true,},
					{ key: 'pasw', title: '密码', icon: '/static/images/login/password.png', focus: false, type: 'text' ,show_right: false,}
				],
				
				btnText: "获取验证码",
				mobile: "",
				code: "",
				max_time: 60, //验证码倒计时最大时间 -- 固定
				time: 60, //验证码倒计时 -- 动态
			}
		},
		computed: {
			//倒计时字体颜色
			timeColor() {
				return this.time != this.max_time ? 'code-btn-color' : '';
			}
		},
		onShow() {
		},
		methods: {
			...mapMutations(['login']),
			getRandom: function(u) {
				let rnd = "";
				u = u || 6;
				for (var i = 0; i < u; i++) {
					rnd += Math.floor(Math.random() * 10);
				}
				return Number(rnd);
			},
			
			//切换登录页面
			tapToLogin() {
				uni.navigateTo({
					url:"../login/login"
				})
			},
			
			//取用户输入的手机号
			inputPhone(event) {
				let value = event.target.value;
				let key = event.currentTarget.dataset.key;
				//发送验证码取值
				if (key == 'phone') {
					this.mobile = value;
					console.log(this.mobile);
				}
			},
			
			btnSend: function() {
				if (util.isNullOrEmpty(this.mobile)) {
					this.tui.toast('请输入手机号码');
					return
				} else if (!util.isMobile(this.mobile)) {
					this.tui.toast('请输入正确的手机号码');
					return
				}
				
				let _this = this;
				//倒计时不能再次发送.
				if (_this.time != _this.max_time) {
					uni.showToast({
						title: '请稍后再尝试',
						icon: 'none'
					});
					return;
				}
				
				//发送成功开始倒计时
				let timeInterval = setInterval(() => {
					_this.btnText = _this.time-- + 's后获取';
					if (_this.time <= 0 - 1) {
						_this.btnText = '发送验证码';
						_this.time = _this.max_time;
						clearInterval(timeInterval);
					}
				}, 1000);
				
				let code = this.getRandom(6);
				this.tui.toast('您本次的验证码是：' + code, 5000);
			},
			
			//注册按钮
			promiseLogin(e) {
				var form_data = e.detail.value; //表单数据
				
				// 用户名、邮箱或手机号 + 密码登录
				// let passwordLogin = new Oauth2.CreateTokenByPasswordImproved(form_data.email, form_data.pasw)
				// this.loginPromiseResolve(passwordLogin) // 使用手机短信验证码登录
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
