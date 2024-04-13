import { Queue, Stack } from "../DataStructures/_Index";
import { libros } from "../data/data";

// Crear una pila para los libros pendientes
const pendingStack = new Stack<string>(3);

// Crear una cola para los géneros de libros
const genres = new Queue<string>(5);
genres.enqueue("Nonfiction");
genres.enqueue("Thriller");
genres.enqueue("Horror");
genres.enqueue("Fantasy");
genres.enqueue("Fiction");

// Elementos del DOM
const results = document.getElementById("results") as HTMLDivElement;
const pending = document.getElementById("pending") as HTMLDivElement;
const categorySelect = document.getElementById("categorySelect") as HTMLDivElement;
const removePending = document.getElementById("removePending") as HTMLDivElement;
const warning = document.getElementById("warning") as HTMLDivElement;

/**
 * Clase que gestiona la visualización de libros por categoría y la funcionalidad de agregar libros pendientes.
 * @class
 */
export class CategoryBooks {
    private categoryBooks: HTMLSelectElement;
    private next: HTMLSelectElement;

    /**
     * Constructor de la clase CategoryBooks.
     * @constructor
     */
    constructor() {
        // Elementos del DOM
        this.categoryBooks = document.getElementById("categoryBooks") as HTMLSelectElement;
        this.next = document.getElementById("next") as HTMLSelectElement;

        // Inicializar los eventos y muestra los libros de la categoría seleccionada
        this.initializeEventListeners();
        this.showCategoryBooks();
    }

    // Inicializa los event listeners para los elementos del DOM.
    private initializeEventListeners(): void {
        this.categoryBooks.addEventListener("change", () => this.showCategoryBooks());
        this.next.addEventListener("click", () => this.moveToNextCategory());
        removePending.addEventListener('click', () => this.removePendingBook());
    }

    // Muestra los libros de la categoría seleccionada.
    private showCategoryBooks(): void {
        categorySelect.textContent = this.categoryBooks.value;
        this.clearResults();

        // Filtra y muestra los libros de la categoría seleccionada
        libros.forEach(book => {
            if (book.category === this.categoryBooks.value) {
                this.renderBook(book);
            }
        });
    }

    // Limpia los resultados de la búsqueda.
    private clearResults(): void {
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }
    }

    /**
     * Renderiza un libro en la interfaz de usuario.
     * @param {object} book - Información del libro a renderizar.
     */
    private renderBook(book: any): void {
        const item = document.createElement("li");
        const addButton = document.createElement("button");
        const filteredContent = document.createElement("div");

        filteredContent.classList.add("filteredContent");
        addButton.textContent = "Add to pending";
        addButton.id = `addButton${book.isbn}`;
        item.textContent = `Title: ${book.title}`;

        // Agrega un event listener para agregar el libro a la lista de pendientes
        addButton.addEventListener('click', () => this.addToPending(book));

        filteredContent.appendChild(item);
        filteredContent.appendChild(addButton);
        results.appendChild(filteredContent);
    }

    /**
     * Agrega un libro a la lista de pendientes.
     * @param {object} book - Libro a agregar a la lista de pendientes.
     */
    private addToPending(book: any): void {
        if (pendingStack.full()) {
            this.showWarning();
        } else {
            const bookInfo = `<strong>Author:</strong> ${book.author} <br><strong>Title:</strong> ${book.title}`;
            pendingStack.push(bookInfo);
            const itemPending = document.createElement("li");
            itemPending.innerHTML = `${pendingStack.topElement()}`;
            pending.appendChild(itemPending);
        }
    }

    // Remueve un libro de la lista de pendientes.
    private removePendingBook(): void {
        if (pendingStack.getTop()) {
            pendingStack.pop();
            if (pending.firstElementChild) pending.removeChild(pending.firstElementChild);
            warning.textContent = "";
        }
    }

    // Muestra una advertencia cuando se alcanza el límite de libros pendientes.
    private showWarning(): void {
        warning.textContent = "Maximum number of books reached";
    }

    // Avanza a la siguiente categoría de libros.
    private moveToNextCategory(): void {
        const currentItem: string = genres.dequeue();
        this.categoryBooks.value = `${currentItem}`;
        genres.enqueue(currentItem);
        this.showCategoryBooks();
    }
}
