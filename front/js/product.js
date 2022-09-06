const baseUrl = "http://localhost:3000/api/products/:id";
let globalProduct = null;

//recuperer le produit du back-end
function getProduct() {

    const id = getIdFromUrl();

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
function getIdFromUrl() {
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

// remplire la liste des couleurs 
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
        
        if (!cart) {
            cart = {};
        }
        if (!cart[globalProduct._id]) {
            cart[globalProduct._id] = {};
        }
        
        
        let newQauntity = cart[globalProduct._id][color] ? cart[globalProduct._id][color] : 0;
        newQauntity += parseInt(quantity);

        if (newQauntity > 100) {
            alert('La quantité total ne peut pas dépasser 100 !');

            return;
        } else {
            cart[globalProduct._id][color] = newQauntity;
        }
        window.localStorage.setItem('cart', JSON.stringify(cart));
        
        if (quantity == 1) {
            alert('Le produit a été ajouter dans le panier');
        } else {
            alert('Les produits ont été ajouter dans le panier');
        }
    }
}

// verifier les entreés de l'utilisateur 
function checkinput(quantity, color) {
    if (quantity < 1) {
        alert("La quantité doit être supérieur à 0 !");

        return false;
    } else if (quantity > 100) {
        alert('La quantité ne peut pas dépasser 100 !');

        return false;
    }

    if (color === '') {
        alert("Vous devez choisir un couleur !");

        return false;
    }

    return true;
}

//-----------------------debut script -----------------------------

// recuperer le produit au demarrage de la page
getProduct();

// attacher le click du bouton addToCart à la fonction addtoCart
document.getElementById('addToCart').onclick = addToCart;