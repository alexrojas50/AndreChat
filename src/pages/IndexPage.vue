<template>
  <q-page padding>
    <loginVist v-if="!isAuthenticated"/>
    <div v-else>

      <UserActivesVistVue />
      <VistaChatVue />
    </div>

  </q-page>
</template>

<script>
import  loginVist  from "../components/loginVist.vue";
import UserActivesVistVue from "src/components/UserActivesVist.vue";
import VistaChatVue from "src/components/VistaChat.vue";
import { auth } from 'boot/firebase'
import { useAuth } from '@vueuse/firebase/useAuth'
import { provide, ref } from "vue";

export default {

  
  components:{
    loginVist,
    UserActivesVistVue,
    VistaChatVue
  },

  setup() {
    const { isAuthenticated, user } = useAuth(auth)
    const userSelect = ref('')

    provide('userSelect', userSelect)

    return {
      isAuthenticated,
    }
  }
}
</script>
