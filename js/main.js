let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productCategory = document.getElementById("productCategory");
let productDesc = document.getElementById("productDesc");
let tableBody = document.getElementById("tableBody");
let searchInput = document.getElementById('searchInput');
let undoBtn = document.getElementById("undoBtn")
let updateBtn = document.getElementById("updateBtn");
let addBtn = document.getElementById("addBtn");
let deleteBtns = document.getElementsByClassName('delete-btn');
let products;

if (localStorage.getItem('myProducts')) {
    products = JSON.parse(localStorage.getItem('myProducts'))
    displayProducts(products);
} else {
    products = [];
}

function addProduct() {
    if (validateName() && validatePrice()) {
        let product = {
            productName: productName.value,
            productPrice: productPrice.value,
            productCategory: productCategory.value,
            productDesc: productDesc.value
        }
        products.push(product);
        console.log(products)
        localStorage.setItem("myProducts", JSON.stringify(products));
        clearForm();
        displayProducts(products)
    }
}
addBtn.addEventListener('click', function () {
    addProduct();
})
function clearForm() {
    productName.value = '';
    productPrice.value = '';
    productCategory.value = '';
    productDesc.value = '';
}
function displayProducts(arr) {
    let container = ``;
    for (let i = 0; i < arr.length; i++) {
        container += `<tr  >
            <td>${i + 1}</td>
            <td>${arr[i].productName}</td>
            <td>${arr[i].productPrice}</td>
            <td>${arr[i].productCategory}</td>
            <td>${arr[i].productDesc}</td>
            <td><button class="  update-btn border-0 py-2 px-3 rounded-5 "  onclick="setFormForUpdate(${i})" >Update</button></td>
            <td><button onclick="deleteProduct(${i})"; class="  delete-btn  border-0 py-2 px-3 rounded-5">Delete</button></td>
        </tr>`
    }
    tableBody.innerHTML = container;
}

// real time search
function search(searchTerm) {
    // let searchTerm = searchInput.value;
    let searchResult = [];
    for (let i = 0; i < products.length; i++) {
        if (products[i].productName.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResult.push(products[i]);
        }
    }
    displayProducts(searchResult);
}
searchInput.addEventListener('keyup', function (e) {
    search(e.target.value)
})

function deleteProduct(deleteIndex) {
    let deletedItem = JSON.stringify(products.splice(deleteIndex, 1));
    console.log("deleted" + deletedItem)
    localStorage.setItem("myProducts", JSON.stringify(products));
    sessionStorage.setItem("deletedProducts", deletedItem);
    sessionStorage.setItem("deletedIndex", deleteIndex);
    displayProducts(products);
    undoBtn.classList.remove('d-none');
    setTimeout(() => {
        undoBtn.classList.add('d-none');
    }, "6000");
}
function undoDelete() {
    let deletedIndex = sessionStorage.getItem('deletedIndex');
    let deletedItem = JSON.parse(sessionStorage.getItem('deletedProducts'));
    console.log("deleted " + typeof deletedItem);
    products.splice(deletedIndex, 0, deletedItem[0])
    console.log(products)
    localStorage.setItem("myProducts", JSON.stringify(products));
    displayProducts(products);

    undoBtn.classList.add('d-none')
}
undoBtn.addEventListener('click', function (e) {
    undoDelete();
})
function setFormForUpdate(updateIndex) {
    productName.value = products[updateIndex].productName;
    productPrice.value = products[updateIndex].productPrice;
    productCategory.value = products[updateIndex].productCategory;
    productDesc.value = products[updateIndex].productDesc;
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');

    sessionStorage.setItem("updateIndex", updateIndex);
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].setAttribute('disabled', 1)
    }

}

function updateProduct() {
    let updateIndex = sessionStorage.getItem('updateIndex');
    let newUpdatedProduct = {
        productName: productName.value,
        productPrice: productPrice.value,
        productCategory: productCategory.value,
        productDesc: productDesc.value
    }
    // console.log(newUpdatedProduct);
    products[updateIndex] = newUpdatedProduct;
    localStorage.setItem("myProducts", JSON.stringify(products));
    displayProducts(products);
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    clearForm();
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].removeAttribute('disabled')
    }
}
updateBtn.addEventListener('click', function (e) {
    updateProduct();
})
function validateName() {
    let regex = /^[A-Z]{1}[a-z]{2,10}\s?\S{0,6}$/;
    if (regex.test(productName.value)) {
        productName.classList.replace('is-invalid', 'is-valid')
        // console.log(true)
        return true
    } else {
        productName.classList.add('is-invalid')
        return false
    }
}
productName.addEventListener('keyup', function (e) {
    validateName()
})

function validatePrice() {
    let regex = /^[1-9][0-9]{3,}$/;
    if (regex.test(productPrice.value)) {
        productPrice.classList.replace('is-invalid', 'is-valid')
        // console.log(true)
        return true
    } else {
        productPrice.classList.add('is-invalid')
        return false
    }
}
productPrice.addEventListener('keyup', function (e) {
    validatePrice()
})

