
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";




 const firebaseConfig = {
   apiKey: "AIzaSyDCmgRqeATI_6IJTHKo81JF384Wg7Cl-jg",
   authDomain: "beershopbd.firebaseapp.com",
   projectId: "beershopbd",
   storageBucket: "beershopbd.appspot.com",
   messagingSenderId: "44041212719",
   appId: "1:44041212719:web:58a2bec8efd7fa2e2f87da"
 };


 const app = initializeApp(firebaseConfig);
 const firestore = getFirestore(app);
 console.log("Conexión establecida correctamente a Firestore");
 export default firestore;