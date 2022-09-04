const productUrl = "http://localhost:3000/api/products/:id";
const orderUrl = "http://localhost:3000/api/products/order";
let cart = {}
let totalQuatity = 0;
let totalPrice = 0;

const itemModel = `<article class="cart__item" data-id=":id" data-color=":color:">
                <div class="cart__item__img">
                  <img src=":image" alt=":alt">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>:name:</h2>
                    <p>:color:</p>
                    <p>:price: €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>:quantity: : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=":quantity:">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
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
        for (const productColor in cart[productId]) {
            const remoteProduct = getRemoteProduct(productId);
            if (remoteProduct === null) {
                cleanItemsView();
                alert('Erreur: on ne peut pas contacter le backend.')
            }
            const quantity = parseInt(cart[productId][productColor]);
            totalPrice += remoteProduct.price * quantity;
            totalQuatity += quantity;
            showProductItem(remoteProduct, productColor, quantity);
        }
    }

    showUpdateAndQuantity(totalPrice, totalQuatity);
    bindDeleteEditItem();
}

// supprimer le pannier dans HTML 
function cleanItemsView() {
    document.getElementById('cart__items').innerHTML = '';
}

//afficher le prix total et la quantity total
function showUpdateAndQuantity(price, quantity) {
    document.getElementById('totalQuantity').innerHTML = quantity;
    document.getElementById('totalPrice').innerHTML = price;
}

// afficher les articles dans html 
function showProductItem(product, color, quantity) {
    const productHtml = itemModel
        .replaceAll(':id', product._id)
        .replaceAll(':image', product.imageUrl)
        .replaceAll(':alt', product.altTxt)
        .replaceAll(':name:', product.name)
        .replaceAll(':quantity:', quantity)
        .replaceAll(':price:', product.price)
        .replaceAll(':color:', color);
    document.getElementById('cart__items').innerHTML += productHtml;
}

// recuperer le product du backend
function getRemoteProduct(productId) {
    const request = new XMLHttpRequest();
    request.open('GET', productUrl.replace(':id', productId), false);
    request.send(null);

    if (request.status == 200) {
        return JSON.parse(request.responseText);
    }

    return null;
}

// ajouter les actions pour effacer ou modifier un article
function bindDeleteEditItem() {
    const allDeleteButton = document.getElementsByClassName('deleteItem');
    for (let i = 0; i < allDeleteButton.length; i++) {
        const element = allDeleteButton[i];
        const articleElement = element.parentNode.parentNode.parentNode.parentNode;
        const id = articleElement.getAttribute('data-id');
        const color = articleElement.getAttribute('data-color');
        element.onclick = () => removeItem(id, color);
    }

    const allinputs = document.getElementsByName('itemQuantity');
    for (let i = 0; i < allinputs.length; i++) {
        const element = allinputs[i];
        const articleElement = element.parentNode.parentNode.parentNode.parentNode;
        const id = articleElement.getAttribute('data-id');
        const color = articleElement.getAttribute('data-color');
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
    if (value <= 0 || value > 100) {
        alert('valeur incorrecte');
        return;
    }

    cart[id][color] = value;
    window.localStorage.setItem('cart', JSON.stringify(cart));
    showUpdateCart();
}

//verifier les donnees du formulaire et envoyer la commande au backend
function submitForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;

    let error = false;

    if (firstName.length < 2 || firstName.length > 30 || !/^[a-zA-Z ]+$/.test(firstName)) {
        document.getElementById('firstNameErrorMsg').innerText = 'Prénom invalide';
        error = true;
    }

    if (lastName.length < 2 || lastName.length > 30 || !/^[a-zA-Z ]+$/.test(lastName)) {
        document.getElementById('lastNameErrorMsg').innerText = 'Nom invalide';
        error = true;
    }

    if (address.length < 10 || address.length > 50) {
        document.getElementById('addressErrorMsg').innerText = 'Adresse invalide';
        error = true;
    }

    if (city.length < 2 || city.length > 30 || !/^[a-zA-Z ]+$/.test(city)) {
        document.getElementById('cityErrorMsg').innerText = 'Ville invalide';
        error = true;
    }

    if (!validateEmail(email)) {
        document.getElementById('emailErrorMsg').innerText = 'Email invalide';
        error = true;
    }

    if (!error) {
        const orderId = confirmOrder(firstName, lastName, address, city, email);
        if (orderId !== null) {
            window.localStorage.removeItem('cart');
            window.localStorage.setItem('orderId', orderId);
            window.location.href = './confirmation.html';
        }
    }

    return false;
}

// verifier que l'Email est correct 
function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

// confirmer l'ordre de commande et sauvgarder l'order Id
function confirmOrder(firstName, lastName, address, city, email) {

    const payload = {
        contact: {
            firstName,
            lastName,
            address,
            city,
            email
        },
        products: Object.keys(cart)
    }
    const order = sendCommand(payload);

    return order ? order.orderId : null;
}

// envoyer la commande au backend 
function sendCommand(payload) {
    const request = new XMLHttpRequest();
    request.open('POST', orderUrl, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(payload));

    if (request.status == 201) {
        return JSON.parse(request.responseText);
    }
    alert('erreur serveur');

    return null;
}

//-----------------------debut script -----------------------------

//afficher le pannier au demarrage
showUpdateCart();
document.getElementsByTagName('form')[0].onsubmit = submitForm;