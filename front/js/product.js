let globalProduct = null;

//récuperer le produit du back-end
function getProduct() {

    let id = getIdFromUrl();

    if (id === null) {
        alert("L'identifiant du product est vide !!!!");

        return;
    }
    
    fetch('http://localhost:3000/api/products/' + id)
    .then(response => response.json())
    .then(response => showProductDetails(response));
}

// récuperer l'id du produit de l'url
function getIdFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('id');
}

// afficher le produit dans html 
function showProductDetails(product) {
    globalProduct = product;

    let img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);

    document.getElementById('img').append(img);
    document.getElementById('title').innerText += product.name;
    document.title = product.name;
    document.getElementById('price').innerText += product.price;
    document.getElementById('description').innerText += product.description;
    fillColor(product.colors);
}

// remplire la liste des couleurs 
function fillColor(colors) {
    colors.forEach(color => {
        let option = document.createElement('option');
        option.setAttribute('value', color);
        option.innerText = color;
        document.getElementById('colors').append(option);
    });
}

// ajouter un produit au panier (localStorage)
function addToCart() {
    let quantity = document.getElementById('quantity').value;
    let color = document.getElementById('colors').value;

    if (checkinput(quantity, color)) {
        // récuperer le pnier depuis le navigateur
        let cart = JSON.parse(window.localStorage.getItem('cart'));
        
        // initialiser le panier si elle est vide (pour évite l'acces sur un objet null)
        if (!cart) {
            cart = {};
        }

        // initialiser le produit si il n'est pas dans panier avant (pour évite l'acces sur un objet null) 
        if (!cart[globalProduct._id]) {  
            cart[globalProduct._id] = {};
        }
        
    
        let oldQauntity = 0

        if(cart[globalProduct._id][color]){
              oldQauntity = cart[globalProduct._id][color];  
        }
        
        let newQauntity =  oldQauntity + parseInt(quantity);

        if (newQauntity > 100) {
            alert('La quantité totale ne peut pas dépasser 100 !');

            return;
        } else {
            cart[globalProduct._id][color] = newQauntity;
        }
        //sauvegarder le panier dans le navigateur    
        window.localStorage.setItem('cart', JSON.stringify(cart));
        
        if (quantity == 1) {
            alert('Le produit a été ajouté dans le panier');
        } else {
            alert('Les produits ont été ajoutés dans le panier');
        }
    }
}

// vérifier les entreés de l'utilisateur 
function checkinput(quantity, color) {
    
    if(color === '' && quantity < 1){
        alert("La quantité et la couleur sont erronées !");

        return false;
    }
    
    if (quantity < 1) {
        alert("La quantité doit être supérieure à 0 !");

        return false;
    } else if (quantity > 100) {
        alert('La quantité ne peut pas dépasser 100 !');

        return false;
    }

    if (color === '') {
        alert("Vous devez choisir une couleur !");

        return false;
    }

    return true;
}

//-----------------------debut script -----------------------------

// récuperer le produit au demarrage de la page
getProduct();

// attacher un click au bouton addToCart à la fonction addtoCart
document.getElementById('addToCart').onclick = addToCart;