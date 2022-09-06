const baseUrl = "http://localhost:3000/api/products";

// va etre utiliser comme un model pour afficher le produit
const baseProduct = `<a href="./product.html?id=:id">
            <article>
              <img src=":image" alt=":alt">
              <h3 class="productName">:name</h3>
              <p class="productDescription">:description</p>
            </article>
          </a>`;

// recuperer la liste des produits depuis le backend          
function getProductList() {
    const request = new XMLHttpRequest();

    request.onload = function () {
        const data = this.responseText;
        showProductList(JSON.parse(data));
    };

    request.open('GET', baseUrl);
    request.send(null);
}

//afficher la liste des produits dans html
function showProductList(productsList) {
    productsList.forEach(product => {
        renderProduct(product);
    });

}

//afficher un seul produit dans html 
function renderProduct(product) {
    const productHtml = baseProduct
        .replace(':id', product._id)
        .replace(':image', product.imageUrl)
        .replace(':alt', product.altTxt)
        .replace(':name', product.name)
        .replace(':description', product.description);
    document.getElementById('items').innerHTML += productHtml;
}

//-----------------------debut script -----------------------------

// afficher la liste des produits au demarrage de la page
getProductList();