let url = 'https://market-349b.restdb.io/rest';
let productForm = document.getElementById('add_product_form');

productForm.addEventListener("submit", function(event) {
	event.preventDefault();
	let data = JSON.stringify({
        "name":event.target['name'].value,
        "description":event.target['description'].values,
        "price":event.target['price'].values,
        "photo_url":event.target['photo_url'].values,
	});

	let xhr = new XMLHttpRequest();
	xhr.withCredentials = false;

	xhr.addEventListener('readystatechange', function() {
		if(this.readyState === 4) {
			console.log(this.responseText);
		}
	});

	xhr.open('POST', url + '/products');
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "6414a0b0bc22d22cf7b26016");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
})

let orders = document.getElementById('admin_page_orders');

let xhr = new XMLHttpRequest();
	xhr.open("GET", url + '/orders')
	xhr.responseType = 'json';
	xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "6414a0b0bc22d22cf7b26016");
	xhr.setRequestHeader("cache-control", "no-cache");

	xhr.onload = function() {
		xhr.response.forEach(function(order) {
			let orderElement = document.createElement('div');
			orderElement.classList.add('product');
			let statusColor = 'green';
			if(order.status == 'Completed'){
				statusColor = 'yellow';
			}

			orderElement.innerHTML += `
				<h2>Order ${order._id}</h2>
				<p><b>Status:</b> <span style="color:${statusColor}">${order.status}</span></p>
				<p><b>Customer name:</b> ${order.name}</p>
				<p><b>Address:</b> ${order.address}</p>
				<p><b>Phone:</b> ${order.phone}</p>
				<p><b>Post Number:</b> ${order.post_number}</p>
			`;
			let sum = 0;
			order.products.forEach(function (p){
				orderElement.innerHTML += `
					<p><img height="50" width="50" src="${p.photo_url}" alt="${p.name}">${p.name} |${p.price}</p>
				`;
				sum += +p.price;
			});
			orderElement.innerHTML += `
				<p>Total price: ${sum}UAH</p>
				<button onclick="complete('${order._id}')">Mark as Completed</button>
			`;
			orders.append(orderElement);

		})
	}

	xhr.send();

function complete(id) {
	var data = JSON.stringify({
		"status": "Completed"
	});
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if(xhr.status == 200) {
			location.reload();
		}else {
			alert('Server error');
		}
	}

	xhr.open("PUT", url + '/orders/' + id)
	xhr.responseType = 'json';
	xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "6414a0b0bc22d22cf7b26016");
	xhr.setRequestHeader("cache-control", "no-cache");

	xhr.send(data);
}	