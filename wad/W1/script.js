const products = [
    {
        image: "images/headphones.jpg",
        name: "Wireless Headphones",
        price: "&#8377;7,999",
        description: "Noise-cancelling over-ear headphones."
    },
    {
        image: "images/smartwatch.jpg",
        name: "Smartwatch",
        price: "&#8377;12,999",
        description: "Fitness tracking smartwatch."
    },
    {
        image: "images/mouse.jpg",
        name: "Gaming Mouse",
        price: "&#8377;2,499",
        description: "Ergonomic gaming mouse."
    },
    {
        image: "images/stand.jpg",
        name: "Laptop Stand",
        price: "&#8377;1,999",
        description: "Adjustable aluminium laptop stand."
    },
    {
        image: "images/keyboard.jpg",
        name: "Mechanical Keyboard",
        price: "&#8377;5,499",
        description: "Backlit keyboard with blue switches."
    },
    {
        image: "images/speaker.jpg",
        name: "Bluetooth Speaker",
        price: "&#8377;3,299",
        description: "Portable speaker with clear sound."
    },
    {
        image: "images/camera.jpg",
        name: "Web Camera",
        price: "&#8377;2,999",
        description: "HD webcam for video calls."
    },
    {
        image: "images/charger.jpg",
        name: "Fast Charger",
        price: "&#8377;1,299",
        description: "USB fast charger for mobile phones."
    },
    {
        image: "images/bag.jpg",
        name: "Laptop Bag",
        price: "&#8377;1,799",
        description: "Water-resistant laptop backpack."
    },
    {
        image: "images/powerbank.jpg",
        name: "Power Bank",
        price: "&#8377;2,199",
        description: "10000 mAh portable power bank."
    },
    {
        image: "images/monitor.jpg",
        name: "LED Monitor",
        price: "&#8377;9,999",
        description: "Full HD monitor for work and study."
    },
    {
        image: "images/printer.jpg",
        name: "Inkjet Printer",
        price: "&#8377;6,499",
        description: "Colour printer for home use."
    }
];

const productsPerPage = 10;
let currentPage = 1;

function displayProducts() {
    const tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = products.slice(start, end);

    pageProducts.forEach(function(product) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="image-text">${product.name}</span>
            </td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
        `;

        tableBody.appendChild(row);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(products.length / productsPerPage);

    document.getElementById("pageInfo").innerText = "Page " + currentPage + " of " + totalPages;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
    }
}

function nextPage() {
    const totalPages = Math.ceil(products.length / productsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
    }
}

displayProducts();
