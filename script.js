let productsGrid = document.getElementById('products-grid');
let modal = document.getElementById('myModal');
let productsArray = [];
let xhr = new XMLHttpRequest();
let url = 'https://market-349b.restdb.io/rest';

xhr.open('GET', url + '/product');
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", "6414a0b0bc22d22cf7b26016");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.responseType = 'json';
xhr.onload = function() {
	productsArray = xhr.response;
	productsGrid.innerHTML = null;
	productsArray.forEach(p => {
		//productsArray.push(p);
		let pElem = document.createElement('div');
		pElem.classList.add('product');
		pElem.innerHTML = `
			<h2 class = 'products-name'>${p.name}</h2>
			<img class = 'products-photo' src = '${p.photo_url}' alt = '${p.name}'>
			<p class = 'products-price'><b>Price: </b>${p.price}UAH</p>
			<p class = 'products-description'><b>Description: </b>${p.description}</p>
			<a href="profile.html?id=${p.author_id}">Selfer profile</a>
			<button onclick="addProductToCart('${p._id}')">Buy</button>
		`;
		productsGrid.append(pElem);
	});
}

xhr.send();

let cartProd = document.getElementById('cart-products');

let cart = [];

if(localStorage.getItem("cart")){
	cart = JSON.parse(localStorage.getItem("cart"));
	drawCartProducts();
}

function addProductToCart(id){
	let product = productsArray.find(function(p) {
		return p._id == id;
	})
	cart.push(product);
	localStorage.setItem("cart", JSON.stringify(cart));
	drawCartProducts();
	let btn = document.getElementById("cart-button");
	btn.classList.add("active");
	setTimeout(function() {
		btn.classList.remove("active");
	},500)
}

function drawCartProducts() {
	if(cart.length == 0) return cartProd.innerHTML= 'Cart is empty';
	cartProd.innerHTML = null;
	let sum = 0;
	cart.forEach(function(p) {
		cartProd.innerHTML += `
		<p><img src="${p.photo_url}" alt="${p.name}">${p.name} |${p.price}UAH$</p>
		<hr>
		`;
		sum += +p.price;
	})
	cartProd.innerHTML += `
	<p>Total price: ${sum}UAH</p>
	<button onclick="buyAll()">Buy all</button>
	`
}

let orderBlock = document.getElementById('order-block');

let span = document.getElementsByClassName('close')[0];

span.onclick = function() {
	modal.style.display = 'none';
}

window.onclick = function() {
	if(event.target == modal) {
		modal.style.display = 'none';
	}
}

function buyAll(){
	// cart = [];
	// localStorage.setItem("cart", "[]");
	// cartProd.innerHTML = 'Money was withdrawn from your credit card';
	modal.style.display = 'block';
	let sum = 0;
	orderBlock.innerHTML = null;
	cart.forEach(function (p) {
		orderBlock.innerHTML += `
			<div class="item">
				<img width="100px" src="${p.photo_url}" alt="${p.name}">
				<h2>${p.name} | ${p.price}UAH</h2>
			</div>
		`

		sum += +p.price;
	})

	document.getElementById('price').innerHTML = sum + 'UAH';

}


function openCart(){
	cartProd.classList.toggle('hide');
}

document.getElementById('order-form').addEventListener("submit" , function(e) {
	e.preventDefault();
	console.log("test");

	let data = JSON.stringify({
		"name": e.target['name'].value,
		"address":e.target['address'].value,
		"phone": e.target['phone'].value,
		"post_number": e.target['post_number'].value,
		"status": "New",
		"products": localStorage.getItem('cart')
	});

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url + '/orders')
	xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "6414a0b0bc22d22cf7b26016");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.send(data);

	modal.style.display = 'none';
	cart = [];
	cartProd.innerHTML = 'Money was withdrawn from your credit card';
	localStorage.setItem("cart", '[]');
})

