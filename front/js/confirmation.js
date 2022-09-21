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
    sendCommand(payload);
}

// envoyer la commande au backend 
function sendCommand(payload) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)   
    })
    .then(response => response.json())
    .then(response => showOrderId(response.orderId));
}

// vider panier, sauvegader orderId et redirection vers la page de confirmation 
function cleanCartAndSetOrder(orderId){
     {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('contact');
        
    }
}

// afficher l'order id
function showOrderId(orderId) {  
    document.getElementById('orderId').innerText = orderId;
    cleanCartAndSetOrder();
}

//-----------------------debut script -----------------------------
confirmOrder();