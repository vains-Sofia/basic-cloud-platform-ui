<template>
	<div class="device-auth-success">
		<!-- 成功提示卡片 -->
		<el-card class="success-card" shadow="hover">
			<div class="success-content">
				<!-- 成功图标 -->
				<div class="icon-container">
					<el-icon class="success-icon" :size="80">
						<CircleCheckFilled />
					</el-icon>
				</div>

				<!-- 标题 -->
				<h2 class="success-title">设备验证成功！</h2>

				<!-- 描述信息 -->
				<p class="success-description">
					您的设备已成功通过验证，现在可以正常使用所有功能。
				</p>

				<!-- 自动跳转倒计时 -->
				<div v-if="countdown > 0" class="countdown-info">
					<el-text type="info">
						<el-icon><Clock /></el-icon>
						{{ countdown }}秒后自动跳转
					</el-text>
				</div>
			</div>
		</el-card>

		<!-- 背景装饰 -->
		<div class="background-decoration">
			<div class="decoration-circle circle-1" />
			<div class="decoration-circle circle-2" />
			<div class="decoration-circle circle-3" />
		</div>
	</div>
</template>

<script setup lang="ts">
import Clock from '~icons/ep/clock'
import { onMounted, onUnmounted, ref } from 'vue'
import CircleCheckFilled from '~icons/ep/circle-check-filled'

// 定义事件
const emit = defineEmits(['continue', 'return'])

// 倒计时
const countdown = ref(0)
let timer = undefined as any

// 处理继续使用
const handleContinue = () => {
	emit('continue')
}

// 启动倒计时
const startCountdown = () => {
	timer = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(timer)
			handleContinue()
		}
	}, 1000)
}

onMounted(() => {
	startCountdown()
})

onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
	}
})
</script>

<style scoped>
.device-auth-success {
	position: relative;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px;
	box-sizing: border-box;
}

.success-card {
	max-width: 500px;
	width: 100%;
	border-radius: 20px;
	border: none;
	position: relative;
	z-index: 2;
}

.success-card :deep(.el-card__body) {
	padding: 40px 30px;
}

.success-content {
	text-align: center;
}

.icon-container {
	margin-bottom: 20px;
}

.success-icon {
	color: #67c23a;
	animation: scaleIn 0.5s ease-out;
}

.success-title {
	font-size: 28px;
	font-weight: 600;
	color: #303133;
	margin: 20px 0 10px 0;
	animation: fadeInUp 0.6s ease-out 0.2s both;
}

.success-description {
	font-size: 16px;
	color: #606266;
	margin-bottom: 30px;
	line-height: 1.6;
	animation: fadeInUp 0.6s ease-out 0.4s both;
}

.countdown-info {
	margin-top: 20px;
	padding: 10px;
	background-color: #f5f7fa;
	border-radius: 8px;
	animation: fadeInUp 0.6s ease-out 0.6s both;
}

.countdown-info .el-text {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}

/* 背景装饰 */
.background-decoration {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 1;
}

.decoration-circle {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	animation: float 6s ease-in-out infinite;
}

.circle-1 {
	width: 100px;
	height: 100px;
	top: 10%;
	left: 10%;
	animation-delay: 0s;
}

.circle-2 {
	width: 150px;
	height: 150px;
	top: 60%;
	right: 10%;
	animation-delay: 2s;
}

.circle-3 {
	width: 80px;
	height: 80px;
	bottom: 20%;
	left: 20%;
	animation-delay: 4s;
}

/* 动画效果 */
@keyframes scaleIn {
	from {
		transform: scale(0);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes fadeInUp {
	from {
		transform: translateY(30px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-20px);
	}
}

/* 移动端适配 */
@media (max-width: 768px) {
	.device-auth-success {
		padding: 10px;
	}

	.success-card {
		margin: 0;
	}

	.success-card :deep(.el-card__body) {
		padding: 30px 20px;
	}

	.success-title {
		font-size: 24px;
	}

	.success-description {
		font-size: 14px;
	}

	.success-icon {
		font-size: 60px !important;
	}
}
</style>
