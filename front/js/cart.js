let cart = {}
let totalQuatity = 0;
let totalPrice = 0;

// afficher les produits du pannier dans html
function showUpdateCart() {
    cleanItemsView();
    totalPrice = 0;
    totalQuatity = 0;

    cart = JSON.parse(window.localStorage.getItem('cart'));

    if (cart === null) {
        showUpdatePriceAndQuantity(0, 0);
        return;
    }
    
    for (const productId in cart) {
        let remoteProduct = getRemoteProduct(productId);
        
        if (remoteProduct === null) {
            cleanItemsView();
            alert('Erreur: on ne peut pas contacter le serveur.')
            return;
        }

        for (let productColor in cart[productId]) {
            
            let quantity = parseInt(cart[productId][productColor]);
            totalPrice += remoteProduct.price * quantity;
            totalQuatity += quantity;
            showProductItem(remoteProduct, productColor, quantity);
        }
    }

    showUpdatePriceAndQuantity(totalPrice, totalQuatity);
    bindDeleteEditItem();
}

// supprimer le pannier dans HTML 
function cleanItemsView() {
    document.getElementById('cart__items').innerHTML = '';
}

//afficher le prix total et la quantity total
function showUpdatePriceAndQuantity(price, quantity) {
    document.getElementById('totalQuantity').innerText = quantity;
    document.getElementById('totalPrice').innerText = price;
}

// afficher les articles dans html 
function showProductItem(product, color, quantity) {
    let article = document.createElement('article');
    let div1 = document.createElement('div');
    let img = document.createElement('img');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let h2 = document.createElement('h2');
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let div4 = document.createElement('div');
    let div5 = document.createElement('div');
    let p3 = document.createElement('p');
    let input = document.createElement('input');
    let div6 = document.createElement('div');
    let p4 = document.createElement('p');

    p4.setAttribute('class', 'deleteItem');
    p4.innerText = 'Supprimer';

    div6.setAttribute('class', 'cart__item__content__settings__delete');
    div6.append(p4);

    p3.innerText = quantity;
    input.setAttribute('type', 'number');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('min', '1');
    input.setAttribute('max', '100');
    input.setAttribute('value', quantity);

    div5.setAttribute('class', 'cart__item__content__settings__quantity');
    div5.append(p3, input);

    div4.setAttribute('class', 'cart__item__content__settings')

    div4.append(div5, div6);

    p2.innerText = product.price;
    p1.innerText = color;
    h2.innerText = product.name;
    
    div3.setAttribute('class', 'cart__item__content__description');
    div3.append(h2, p1, p2);

    div2.setAttribute('class', 'cart__item__content');
    div2.append(div3, div4);
    
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt); 

    div1.setAttribute('class', 'cart__item__img');
    div1.append(img);

    article.setAttribute('class', 'cart__item');
    article.setAttribute('data-id', product._id);
    article.setAttribute('data-color', color);

    article.append(div1, div2);

    document.getElementById('cart__items').append(article);
}

// récuperer le product du backend
function getRemoteProduct(productId) {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3000/api/products/' + productId, false);
    request.send(null);

    if (request.status == 200) {
        return JSON.parse(request.responseText);
    }

    return null;
}

// ajouter les actions pour effacer ou modifier un article
function bindDeleteEditItem() {
    let allDeleteButton = document.getElementsByClassName('deleteItem');
    
    for (let i = 0; i < allDeleteButton.length; i++) {
        let element = allDeleteButton[i];
        let articleElement = element.parentNode.parentNode.parentNode.parentNode;
        let id = articleElement.getAttribute('data-id');
        let color = articleElement.getAttribute('data-color');
        element.onclick = () => removeItem(id, color);
    }

    let allinputs = document.getElementsByClassName('itemQuantity');
    
    for (let i = 0; i < allinputs.length; i++) {
        let element = allinputs[i];
        let articleElement = element.parentNode.parentNode.parentNode.parentNode;
        let id = articleElement.getAttribute('data-id');
        let color = articleElement.getAttribute('data-color');
        element.onchange = () => editItem(id, color, element.value);
    }
}

// supprimer element dans le panier
function removeItem(id, color) {
    delete cart[id][color];

    if (!cart[id]) {
        delete cart[id];
    }
    window.localStorage.setItem('cart', JSON.stringify(cart));
    showUpdateCart();
}

// edit element dans le panier
function editItem(id, color, value) {
    if (value <= 0) {
        alert('La quantité doit être supérieur à 0 !');
        
        return;
    }else if(value > 100){
        alert('La quantité ne peut pas dépasser 100 !');
        
        return;
    }

    cart[id][color] = parseInt(value);
    window.localStorage.setItem('cart', JSON.stringify(cart));
    showUpdateCart();
}

//verifier les donnees du formulaire et envoyer la commande au backend
function submitForm() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('email').value;

    let error = false;

    if (firstName.length < 2 || firstName.length > 30 || !/^[a-zA-Z ]+$/.test(firstName)) {
        document.getElementById('firstNameErrorMsg').innerText = 'Merci de fournir un Prénom valide';
        error = true;
    }else{
        document.getElementById('firstNameErrorMsg').innerText ='';
    }

    if (lastName.length < 2 || lastName.length > 30 || !/^[a-zA-Z ]+$/.test(lastName)) {
        document.getElementById('lastNameErrorMsg').innerText = 'Merci de fournir un Nom valide';
        error = true;
    }else{
        document.getElementById('lastNameErrorMsg').innerText = '';
    }

    if (address.length < 10 || address.length > 50) {
        document.getElementById('addressErrorMsg').innerText = 'Merci de fournir une Adresse valide';
        error = true;
    }else{
        document.getElementById('addressErrorMsg').innerText = '';
    }

    if (city.length < 2 || city.length > 30 || !/^[a-zA-Z ]+$/.test(city)) {
        document.getElementById('cityErrorMsg').innerText = 'Merci de fournir une Ville valide';
        error = true;
    }else{
        document.getElementById('cityErrorMsg').innerText ='';
    }

    if (!validateEmail(email)) {
        document.getElementById('emailErrorMsg').innerText = 'Merci de fournir un Email valide';
        error = true;
    }else{
        document.getElementById('emailErrorMsg').innerText ='';
    }

    if (!error && totalPrice > 0) {
        let contact = {
            firstName,
            lastName,
            address,
            city,
            email
        };
        
        window.localStorage.setItem('contact', JSON.stringify(contact));
        window.location.href = './confirmation.html';
    }

    return false;
}


// verifier que l'Email est correct 
function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}



//-----------------------debut script -----------------------------

//afficher le pannier au demarrage
showUpdateCart();
document.getElementsByTagName('form')[0].onsubmit = submitForm; 