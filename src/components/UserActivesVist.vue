<template>
 <q-page-sticky position="top" expand class="tabs-zindex">
    <q-tabs
        v-model="userSelect"
        inline-label
        outside-arrows
        mobile-arrows
        class="bg-pink-5 text-white shadow-2 full-width"
      >
        <q-tab v-for="user in users" :key="user.uid" 
        :name="user.uid" icon="account_circle" :label="user.name" :class="user.sessionStatus? 'text-white':'text-grey'"/>
      </q-tabs>
 </q-page-sticky>


</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { db, auth } from 'src/boot/firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from '@vueuse/firebase/useAuth'
const { isAuthenticated, user } = useAuth(auth)

    export default {
        setup() {
            const userSelect = inject('userSelect')
            const firstTime = ref(true)
            const users = ref([])


            // const q = query(collection(db, "users"));
            //     onSnapshot(q, (snapshot) => {
            //     snapshot.docChanges().forEach((change) => {
            //             if (change.type === "added") {
            //                 console.log("New User: ", change.doc.data());
            //             }
            //             if (change.type === "modified") {
            //                 console.log("Modified User: ", change.doc.data());
            //             }
            //             if (change.type === "removed") {
            //                 console.log("Removed er: ", change.doc.data());
            //             }
            //         });
            //     });

            //     const test = () => {
            //     const q = query(collection(db, "users"), where("sessionStatus", "==", true));
            //     onSnapshot(q, (querySnapshot) => {
            //         querySnapshot.docChanges().forEach((change) => {
            //             if (change.type === "added") {
            //                 console.log("New User: 2222222222", change.doc.data());
            //             }
            //             if (change.type === "modified") {
            //                 console.log("Modified User: 2222222222", change.doc.data());
            //             }
            //             if (change.type === "removed") {
            //                 console.log("Removed er: 2222222222", change.doc.data());
            //             }
            //         });



            //         const users = [];
            //         querySnapshot.forEach((doc) => {
            //             if (user.value.email != doc.data().email) users.push(doc.data().name);
            //         });
            //         console.log("Current actives Users: ", users.join(", "));
            //     });
            // }


                const q = query(collection(db, "users"));
                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            if (change.doc.data().uid !== user.value.uid){
                            users.value.push(change.doc.data())
                            }
                        }
                        if (change.type === "modified") {
                            users.value = users.value.map(user => {
                                if (user.uid === change.doc.data().uid) {
                                    user.sessionStatus = change.doc.data().sessionStatus
                                    return user
                                } else {
                                    return user
                                }
                            })
                        }
                        if (change.type === "removed") {
                            console.log("Removed er: 2222222222", change.doc.data());
                        }
                    });
                });
            



            return {
                userSelect,
                users
            }
        }
    }

</script>

<style>

    .tabs-zindex {
        z-index: 2000;
    }

</style>