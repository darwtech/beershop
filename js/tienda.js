import firestore from "./firedatabase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const tiendaProductos = document.getElementById('contenedor-tienda');

const mostrarDatosTienda = async () => {
    const querySnapshot = await getDocs(collection(firestore, "Productos"));
    let contenidoTienda = ''; // Creamos una variable para almacenar el contenido HTML
    
    querySnapshot.forEach((doc) => {
        const producto = doc.data();
        const fila = `
        <div class="box">
        <a href="">
          <div class="img-box">
            <img src="${producto.imagenUrl}" alt="">
          </div>
          <div class="detail-box">
            <h6 class="price">
             $ ${producto.precio}
            </h6>
            <h6>
              ${producto.nombre}
            </h6>
          </div>
        </a>
      </div>
        `;
        contenidoTienda += fila; // Agregamos la fila al contenido
    });

    // Agregamos el contenido al elemento tiendaProductos
    tiendaProductos.innerHTML = contenidoTienda;
};

// Mostramos los datos de la tienda al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    await mostrarDatosTienda();
});