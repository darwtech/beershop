
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";




 const firebaseConfig = { //Aqui pon tu cadena de conexion a firebase
   apiKey: "",
   authDomain: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: "",
   appId: ""
 };


 const app = initializeApp(firebaseConfig);
 const firestore = getFirestore(app);
 console.log("Conexión establecida correctamente a Firestore");
 export default firestore;
