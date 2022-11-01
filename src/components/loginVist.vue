<template>

    <div class="q-px-xl">

        <h5>{{ login ? 'Ingresa a tu cuenta': 'Crea una cuenta'}}</h5>

        <q-form class="q-gutter-md" @submit.prevent="submit">

            <q-input 
            v-if="!login"
            ref="inputName"
            label="Nombre"  
            v-model="userName"
            :maxlength="30"
            :rules="[ val => val && val.length > 4 || 'Mínimo 4 caractes']"
            />

            <q-input 
            ref="inputEmail"
            label="Email"  
            v-model="userEmail"
            :maxlength="30"
            :rules="[ val => val && val.length >= 4 || 'Mínimo 4 caractes']"
            />


            <q-input 
            ref="inputPassword"
            label="Password"  
            v-model="userPassword"
            :maxlength="30"
            type="password"
            :rules="[ val => val && val.length >= 4 || 'Mínimo 4 caractes']"
            />

            <q-btn type="submit" color="primary" :disable="isComplete"> {{ login ? 'Ingresar': 'Registrar' }} </q-btn>
            <q-btn color="primary" outline v-if="!login" @click="ingresar" >¿Ya tienes cuenta?</q-btn>
            <q-btn color="negative" outline v-if="login" @click="registro">¿No tienes cuenta?</q-btn>
        </q-form>

    </div>

</template>

<script>

import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { auth, db } from 'boot/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import { useAuth } from '@vueuse/firebase/useAuth'
import { doc, setDoc, updateDoc, getDoc   } from "firebase/firestore";


    export default {
        setup() {

            const inputName = ref(null)
            const inputEmail = ref(null)
            const inputPassword = ref(null)

            const login = ref(true)
            const userEmail = ref('')
            const userName = ref('')
            const userPassword = ref('')

            const $q = useQuasar();
            const { isAuthenticated, user } = useAuth(auth)
            const repeat = ref(false)

            function NofityError(err) {
                $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: err
              }); 
            }

            function NofityRes(text) {
                $q.notify({
              color: "green-9",
              textColor: "white",
              icon: "warning",
              message: text
              }); 
            }

            function registrar () {

                const notif = $q.notify({
                            group: false,
                            color: "primary",
                            spinner: true,
                            message: 'Please wait...',
                        })
                createUserWithEmailAndPassword(auth, userEmail.value, userPassword.value )
                    .then((Data) => {
                        setDoc(doc(db, "users", Data.user.email), {
                            name: userName.value,
                            email: userEmail.value,
                            sessionStatus: true,
                            uid: Data.user.uid
                        }).then(() =>{
                            notif({
                                color: 'green-9',
                                icon: 'done', // we add an icon
                                spinner: false, // we reset the spinner setting so the icon can be displayed
                                message: "Registro exitoso. Bienvenido, " + userName.value,
                                timeout: 100 // we will timeout it in 2.5s
                            })
                        }) .catch((error) => {
                            console.log(error)
                            NofityError("Algo muy malo ha pasado :<")
                        })
                    })
                    .catch((error) => {
                        let errorDB = error.code
                        if(error.code == "auth/user-not-found") errorDB = "El usuario no existe"
                        NofityError(errorDB)
                    })
            }

             function loginUser () {
                repeat.value = true
                signInWithEmailAndPassword(auth, userEmail.value, userPassword.value )
                    .then(async (Data) => {
                        repeat.value = false
                       const userRef = await doc(db, "users", Data.user.email)
                       await updateDoc(userRef, {
                            sessionStatus: true
                        })
                        let userData = await (await getDoc(userRef)).data()
                        NofityRes("Bienvenido de vuelta, " + userData.name)
                    }).catch((error) => {
                        repeat.value = false
                        console.log(error)
                        let errorDB = error.code
                        if(error.code == "auth/user-not-found") errorDB = "El usuario no existe"
                        NofityError(errorDB)
                    })
            }

            function reset () {
                inputPassword.value.resetValidation()
                inputEmail.value.resetValidation()
                if(login.value) inputName.value.resetValidation()
            }


            

            function validateEmail(email){
                const x = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return x.test(email)

            };

            const ingresar = () => {
                login.value = true               
                reset()
            }

            const registro = () => {
                login.value = false
                reset()
            }


            const submit = async () => {
                try {

                    if(!login.value) registrar()
                    if(login.value) loginUser()


                    // if(!validateEmail(userEmail.value)) throw("Formato de correo inválido")

                    // Ejemplo para actualizar
                    // notif({
                    //     color: 'green-9',
                    //     icon: 'done', // we add an icon
                    //     spinner: false, // we reset the spinner setting so the icon can be displayed
                    //     message: 'Uploading done!',
                    //     timeout: 2000 // we will timeout it in 2.5s
                    // })
                    // const notif = $q.notify({
                    //         group: false,
                    //         color: "primary",
                    //         spinner: true,
                    //         message: 'Please wait...',
                    //     })

                } catch (error  ) {
                    $q.notify({
                        color: "red-5",
                        textColor: "white",
                        icon: "warning",
                        message: error
                    });       
                }
            }


            const isComplete = computed(() => {
                if(
                    !repeat.value &&
                    userEmail.value && userEmail.value.length >= 4 &&
                    userPassword.value && userPassword.value.length >= 4
                ) return false
                return true
            })

            return {

                userEmail,
                login,
                userPassword,
                userName,
                inputPassword,
                inputName,
                inputEmail,
                submit,
                registro,
                ingresar,
                isComplete,
                isAuthenticated, 
                user
                
            }

        }
    }

</script>