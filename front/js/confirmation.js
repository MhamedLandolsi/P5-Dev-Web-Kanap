// confirmer l'ordre de commande et sauvgarder l'order Id
function confirmOrder() {

    let cart = JSON.parse(window.localStorage.getItem('cart'));
    let contact = JSON.parse(window.localStorage.getItem('contact')); 
    
    if(!contact){
        return null;
    }

    if(!cart){
        return null;
    }

    let payload = {
        contact,
        products: Object.keys(cart)
    }
    let order = sendCommand(payload);

    return order ? order.orderId : null;
}

// envoyer la commande au backend 
function sendCommand(payload) {
    const request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3000/api/products/order', false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(payload));

    if (request.status == 201) {
        return JSON.parse(request.responseText);
    }
    alert('erreur serveur');

    return null;
}

// vider panier, sauvegader orderId et redirection vers la page de confirmation 
function cleanCartAndSetOrder(orderId){
     {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('contact');
        
    }
}

// afficher l'order id
function showOrderId() {  
    document.getElementById('orderId').innerText = confirmOrder();
    cleanCartAndSetOrder();
}

//-----------------------debut script -----------------------------
showOrderId();