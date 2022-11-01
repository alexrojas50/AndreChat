<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-pink-5">
      <q-toolbar>

        <q-toolbar-title>
          Andrea Chat
        </q-toolbar-title>

        <q-btn v-if="isAuthenticated" label="Salir" color="red-14" @click="closeSession"/>

      </q-toolbar>
    </q-header>

  

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { auth, db } from 'boot/firebase'
import { useAuth } from '@vueuse/firebase/useAuth'
const { isAuthenticated, user } = useAuth(auth)
import { doc, updateDoc } from "firebase/firestore";



export default {
  name:"MainLayout",

  setup () {

    const $q = useQuasar()


    const closeSession = async () => {
      try {
        $q.notify({
          color: "green-9",
          textColor: "white",
          message: "¡Nos vemos luego!"
        }); 

        const userRef = await doc(db, "users", user.value.email)
        await updateDoc(userRef, {
          sessionStatus: false
        })
        auth.signOut()
        console.log("pasando")
      } catch (error) {
        console.log(error)
      }
    }

    return {
    user,
    isAuthenticated,
    closeSession
    }
  }
}
</script>
