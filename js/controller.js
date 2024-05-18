import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import firestore from "./firedatabase.js";

const storage = getStorage();

// Aquí se obtienen los elementos del DOM
const formulario = document.getElementById('formulario-producto');
const tablaProductos = document.getElementById('tabla-productos');

// Función para subir imágenes a Firebase Storage
async function subirImagen(imagen) {
    const imageRef = ref(storage, 'productos/' + imagen.name);
    await uploadBytes(imageRef, imagen);
    return getDownloadURL(imageRef);
}

// Función para verificar si un producto ya existe en la base de datos
async function verificarProductoExistente(nombreProducto) {
    const querySnapshot = await getDocs(collection(firestore, "Productos"));
    return querySnapshot.docs.some(doc => doc.data().nombre === nombreProducto);
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(e) {
    e.preventDefault();

    const nombreProducto = formulario['txt-nombre'].value;
    const precioProducto = formulario['txt-precio'].value;
    const imagenProducto = formulario['img-in'].files[0];

    try {
        const existeProducto = await verificarProductoExistente(nombreProducto);
        if (existeProducto) {
            alert('El producto ya existe');
            console.error("El producto ya existe.");
            return; // Detiene el proceso de agregar el producto
        }

        const imageUrl = await subirImagen(imagenProducto);
        const guardadoExitoso = await guardarDatos(nombreProducto, precioProducto, imageUrl);
        
        if (guardadoExitoso) {
            formulario.reset();
        } else {
            alert('No se pudo guardar el producto.');
            console.error("No se pudo guardar el producto.");
        }
    } catch (error) {
        console.error("Error al procesar el formulario: ", error);
    }
}

// Función para guardar los datos en la base de datos
async function guardarDatos(nombreProducto, precioProducto, imageUrl) {
    try {
        const docRef = await addDoc(collection(firestore, "Productos"), {
            nombre: nombreProducto,
            precio: precioProducto,
            imagenUrl: imageUrl, 
        });
        await mostrarDatos();
        alert('Producto agregado con Éxito');
        console.log("Producto agregado con ID: ", docRef.id);
        return true;
    } catch (error) {
        alert('Error al agregar el producto');
        console.error("Error al agregar el producto: ", error);
        return false;
    }
}

// Listener para el evento submit del formulario
formulario.addEventListener('submit', manejarEnvioFormulario);

// Función para mostrar los datos en la tabla
async function mostrarDatos() {
    tablaProductos.innerHTML = ''; // Limpiamos la tabla antes de mostrar los nuevos datos

    const querySnapshot = await getDocs(collection(firestore, "Productos"));
    querySnapshot.forEach((doc) => {
        const produc = doc.data();
        const fila = document.importNode(document.getElementById('fila-producto').content, true);
        
        fila.querySelector('img').src = produc.imagenUrl;
        fila.querySelector('td:nth-child(2)').textContent = produc.nombre;
        fila.querySelector('td:nth-child(3)').textContent = produc.precio;
        fila.querySelector('.modificar-btn').dataset.id = doc.id;
        fila.querySelector('.eliminar-btn').dataset.id = doc.id;

        tablaProductos.appendChild(fila);
    });
}

// Función para eliminar un producto de la base de datos
async function eliminarProducto(idProducto) {
    try {
        await deleteDoc(doc(firestore, "Productos", idProducto));
        await mostrarDatos(); // Actualizar la tabla después de eliminar el producto
        alert('Producto eliminado exitosamente');
        console.log("Producto eliminado con ID: ", idProducto);
    } catch (error) {
        alert('Error al eliminar el producto');
        console.error("Error al eliminar el producto: ", error);
    }
}

// Listener para los botones de modificar y eliminar
tablaProductos.addEventListener('click', async (e) => {
    if (e.target.classList.contains('modificar-btn')) {
        const idProducto = e.target.dataset.id;
        const filaProducto = e.target.closest('tr'); // Obtener la fila donde se encuentra el botón
        const nombre = filaProducto.querySelector('td:nth-child(2)').textContent;
        const precio = filaProducto.querySelector('td:nth-child(3)').textContent;
        
        // A continuación, podrías obtener la URL de la imagen si es necesario

        // Cargar los datos en el formulario para modificar
        document.getElementById('txt-nombre').value = nombre;
        document.getElementById('txt-precio').value = precio;
        document.getElementById('formulario-producto').setAttribute('data-id', idProducto); // Guardar el ID del producto en el formulario
    } else if (e.target.classList.contains('eliminar-btn')) {
        const idProducto = e.target.dataset.id;
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            await eliminarProducto(idProducto);
        }
    }
});

// Función para modificar un producto en la base de datos
async function modificarProducto(idProducto, nombreProducto, precioProducto, imageUrl) {
    try {
        const productoRef = doc(firestore, "Productos", idProducto);
        await updateDoc(productoRef, {
            nombre: nombreProducto,
            precio: precioProducto,
            imagenUrl: imageUrl
        });
        await mostrarDatos(); // Actualizar la tabla después de modificar el producto
        alert('Producto modificado exitosamente');
        console.log("Producto modificado con ID: ", idProducto);
    } catch (error) {
        alert('Error al modificar el producto');
        console.error("Error al modificar el producto: ", error);
    }
}


const mostrarDatosTienda = async () => {
    const querySnapshot = await getDocs(collection(firestore, "Productos"));
    querySnapshot.forEach((doc) => {
        const producto = doc.data();
        const fila = `
        <div class="box">
        <a href="">
          <div class="img-box">
            <img src="${producto.imageUrl}" alt="">
          </div>
          <div class="detail-box">
            <h6 class="price">
              ${producto.precio}
            </h6>
            <h6>
              ${producto.nombre}
            </h6>
          </div>
        </a>
      </div>
        `;
        mostrarDatosTienda.innerHTML += fila; // Agregamos la fila a la tabla
    });

  
};









// Mostrar los datos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    await mostrarDatos();
    await mostrarDatosTienda();
});
