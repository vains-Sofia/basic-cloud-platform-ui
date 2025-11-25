<template>
	<OAuthAuthorizeComponent
		:client-id="route.query.client_id as string"
		:scope="route.query.scope as string"
		:state="route.query.state as string"
		:user-code="route.query.user_code as string"
	/>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import OAuthAuthorizeComponent from '../components/OAuthAuthorizeComponent.vue'

const route = useRoute()
</script>
