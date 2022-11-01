<template>
    
    <div v-if="userSelect !== ''" class="q-mt-lg">
        <div class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 100%">
                <q-chat-message v-for="chat in chats" :key="chat.id" :name="chat.name" :text="[chat.texto]" :sent="chat.uid === user.uid"/>
            </div>
        </div>
        <q-form @submit.prevent="enviarMensaje">
            <q-footer>
                <q-toolbar class="bg-pink-5 text-black row q-py-md">
                <q-input rounded outlined dense class="col-grow q-mr-sm" bg-color="white" v-model="message" placeholder="Type a message" />
                <q-btn round flat icon="send" type="submit" :disable="message == ''"/>
                </q-toolbar>
            </q-footer>
        </q-form>
    </div>
    <div v-else class="fixed-center q-mt-xl">
        <h5 class="justify-center">Selecciona un chat</h5>
    </div>

    <div class="">
        
        <q-page-scroller reverse :scroll-offset="20" :offset="[0, 18]" id="Botonparabajar">
            <q-btn fab icon="keyboard_arrow_down" color="pink-5" />
        </q-page-scroller>

    </div>
    
    

</template>

<script>
import { auth, db, timeStamp } from 'src/boot/firebase';
import { inject, ref, watch } from 'vue';
import { useAuth } from '@vueuse/firebase/useAuth'
import { doc, query, onSnapshot, orderBy, collection, addDoc, serverTimestamp, getDocs, getDoc    } from "firebase/firestore";
const { user } = useAuth(auth)

    export default {
        setup() {
            const message = ref('')
            const userSelect = inject('userSelect')
            const chats = ref([])
            const userName1 = ref('')
            const userName2 = ref('')

            let unsub

            const obtenerData = async (userSelect) => {
                chats.value = []

                const querySnapshot2 = await getDocs(collection(db, "users"));
                    querySnapshot2.forEach((doc) => {
                        if(doc.data().uid == user.value.uid) userName1.value = doc.data().name
                        if(doc.data().uid == userSelect) userName2.value = doc.data().name
                });

                const docc = await collection(doc(db, "chats", user.value.uid), userSelect)
                console.log(docc)
                const q = query(docc, orderBy("fecha"));
                    unsub = onSnapshot(q, (querySnapshot) => {
                        console.log("pasando")
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            chats.value.push({...change.doc.data(), id: change.doc.id, name: change.doc.data().user == user.value.email? userName1.value: userName2.value})
                        }
                    });
                });
                console.log(chats.value)
            }

            watch(
                () => userSelect.value,
                (newUid) => {
                    if(unsub) {
                        unsub()
                        if(newUid){
                            obtenerData(newUid)
                        }
                    } else {
                        obtenerData(newUid)
                    }
                }
                )

            const enviarMensaje = async() => {
                try {
                    const objetoMensaje = {
                        user: user.value.email,
                        texto: message.value,
                        fecha: serverTimestamp(),
                        uid: user.value.uid
                    }
                    
                    addDoc(collection(doc(db, "chats", user.value.uid), userSelect.value), objetoMensaje);
                    addDoc(collection(doc(db, "chats", userSelect.value), user.value.uid), objetoMensaje)

                    message.value = ""
                    
                    setTimeout(async () => {
                        const botoncito =await document.getElementById('Botonparabajar')
                        botoncito.click()
                    }, 125);
                    
                } catch (error) {
                    console.log(error)
                }
            }

            console.log("xDDD", user.value)

            return {
                message,
                enviarMensaje,
                userSelect,
                chats,
                user
            }

        }
    }

</script>