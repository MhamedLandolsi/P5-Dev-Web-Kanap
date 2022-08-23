const baseUrl = "http://localhost:3000/api/products";
const baseProduct = `<a href="./product.html?id=:id">
            <article>
              <img src=":image" alt=":alt">
              <h3 class="productName">:name</h3>
              <p class="productDescription">:description</p>
            </article>
          </a>`;

function getProductList() {
    const request = new XMLHttpRequest();

    request.onload = function () {
        const data = this.responseText;
        showProductList(JSON.parse(data));
    };

    request.open('GET', baseUrl);
    request.send(null);
}

function showProductList(productsList) {
    productsList.forEach(product => {
        renderProduct(product);
    });

}
function renderProduct(product) {
    let productHtml = baseProduct
        .replace(':id', product._id)
        .replace(':image', product.imageUrl)
        .replace(':alt', product.altTxt)
        .replace(':name', product.name)
        .replace(':description', product.description);
    document.getElementById('items').innerHTML += productHtml;
}

getProductList();