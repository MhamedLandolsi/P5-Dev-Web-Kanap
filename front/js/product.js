const baseUrl = "http://localhost:3000/api/products/:id";
let globalProduct = null;

//recuperer le produit du back-end
function getProduct() {

    const id = getIdfromUrl();
    if (id === null) {
        alert("l'id du product est vide !!!!");

        return;
    }
    const request = new XMLHttpRequest();

    request.onload = function () {
        const data = this.responseText;
        showProductDetails(JSON.parse(data));
    };

    request.open('GET', baseUrl.replace(':id', id));
    request.send(null);
}

// recuperer l'id du produit de l'url
function getIdfromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('id');
}

// afficher le produit dans html 
function showProductDetails(product) {
    globalProduct = product;
    document.getElementById('img').innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById('title').innerHTML += product.name;
    document.title = product.name;
    document.getElementById('price').innerHTML += product.price;
    document.getElementById('description').innerHTML += product.description;
    fillColor(product.colors);
}

// remplire la liste de couleur 
function fillColor(colors) {
    colors.forEach(color => {
        document.getElementById('colors').innerHTML += `<option value="${color}">${color}</option>`;
    });
}

// ajouter un produit au panier (localStorage)
function addToCart() {
    const quantity = document.getElementById('quantity').value;
    const color = document.getElementById('colors').value;

    if (checkinput(quantity, color)) {
        let cart = JSON.parse(window.localStorage.getItem('cart'));
        if (cart === null) {
            cart = {};
        }
        if (!cart[globalProduct._id]) {
            cart[globalProduct._id] = {};
        }
        cart[globalProduct._id][color] = quantity;

        window.localStorage.setItem('cart', JSON.stringify(cart));
        alert('produit ajouter avec succés');
    }
}

// verifier les entreés de l'utilisateur 
function checkinput(quantity, color) {
    if (quantity < 1 || quantity > 100) {
        alert("quantite invalide");

        return false;
    }

    if (color === '') {
        alert("color invalide");

        return false;
    }

    return true;
}

//-----------------------debut script -----------------------------

// recuperer le produit au demarrage de la page
getProduct();

// attacher le click du bouton addToCart à la fonction addtoCart
document.getElementById('addToCart').onclick = addToCart;