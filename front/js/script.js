// recuperer la liste des produits depuis le backend          
function getProductList() {
    let request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:3000/api/products', false);
    request.send(null);

    if (request.status == 200) {
        showProductList(JSON.parse(request.responseText));
    }    
}

//afficher la liste des produits dans html
function showProductList(productsList) {
    productsList.forEach(product => {
        renderProduct(product);
    });

}

//afficher un seul produit dans html 
function renderProduct(product) {

    let a = document.createElement('a');
    let article = document.createElement('article');
    let img = document.createElement('img');
    let h3 = document.createElement('h3');
    let p = document.createElement('p');

    a.setAttribute('href', './product.html?id=' + product._id);
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);
    h3.setAttribute('class', 'productName');
    h3.innerText = product.name;
    p.setAttribute('class', 'productDescription');
    p.innerText = product.description;
    article.append(img, h3, p);
    a.append(article);
    document.getElementById('items').append(a);
}

//-----------------------debut script -----------------------------

// afficher la liste des produits au demarrage de la page
getProductList();