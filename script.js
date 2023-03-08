let productsGrid = document.getElementById('products-grid');
let productsArray = [];
let xhr = new XMLHttpRequest();
let url = 'https://my-json-server.typicode.com/Sasha118/Product';

xhr.open('GET', url + '/products');
xhr.responseType = 'json';
xhr.onload = function() {
	let products = xhr.response;
	productsGrid.innerHTML = null;
	products.forEach(p => {
		productsArray.push(p);
		let pElem = document.createElement('div');
		pElem.classList.add('products');
		pElem.innerHTML = `
			<h2 class = 'products-name'>${p.name}</h2>
			<img class = 'products-photo' src = '${p.photo_url}' alt = '${p.name}'>
			<p class = 'products-price'><b>Price: </b>${p.price}</p>
			<p class = 'products-description'><b>Description: </b>${p.description}</p>
			<a href="profile.html?id=${p.author_id}">Selfer profile</a>
			<button>Buy</button>
		`;
		productsGrid.append(pElem);
	});
}

xhr.send();
