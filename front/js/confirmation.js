// afficher l'order id
function showOrderId() {
    document.getElementById('orderId').innerText = window.localStorage.getItem('orderId');
}

//-----------------------debut script -----------------------------
showOrderId();