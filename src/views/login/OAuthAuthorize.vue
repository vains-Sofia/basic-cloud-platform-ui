<template>
  <OAuthAuthorizeComponent
    :client-id="route.query.client_id"
    :scope="route.query.scope"
    :state="route.query.state"
    :user-code="route.query.user_code"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import OAuthAuthorizeComponent from "@/views/login/components/OAuthAuthorizeComponent.vue";

const route = useRoute();
</script>
