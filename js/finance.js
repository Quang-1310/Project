let selectElement = document.querySelector("#select");

let arrMonth = [];
let monthElement = document.querySelector("#input-month");

let inputMoney = document.querySelector("#input-money");
let btnSave = document.querySelector("#btn-save");
let moneyEmpty = document.querySelector("#money-empty");
let textMoneyEmpty = document.querySelector("#text-money-empty")

let money = document.querySelector("#money");

let currentUser = JSON.parse(localStorage.getItem("acount"));
if (!currentUser || !currentUser.username) {
    window.location.href = "../pages/login.html";
}
let userId = currentUser.username;

let moneyLocal = JSON.parse(localStorage.getItem(`Money_${userId}`)) || "0";
money.textContent = Number(moneyLocal).toLocaleString("vi-VN") + " VND";

let nameCategory = document.querySelector("#name-category");
let limit = document.querySelector("#limit");
let btnAddCategory = document.querySelector("#add-category");
let monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
let expenditure = document.querySelector(".expenditure");
let typeAddOrSave = 'add';
let editMonthIndex = -1;
let editCategoryIndex = -1;
let count = 0;

let inputMoneySpend = document.querySelector("#input-money-spend");
let selectMoney = document.querySelector("#select-money");
let note = document.querySelector("#note");
let addMoney = document.querySelector("#add-money");

let transactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
let transactionHistory = document.querySelector(".transaction-history");
let containerTransactionContent = document.querySelector(".container-transaction-content");
let inputContent = document.querySelector(".input-content");
let btnSearch = document.querySelector("#btn-search")
let selectPrice = document.querySelector("#select-price");
let filteredTransactions = JSON.parse(localStorage.getItem(`filteredTransactions_${userId}`)) || [];

let currentPage = 1;
const totalPerPage = 3;
const totalPage = Math.ceil(transactions.length/totalPerPage);
const btnPageElement = document.querySelector("#btn-page");
const btnPrev = document.querySelector("#btn-previous");
const btnNext = document.querySelector("#btn-next");


selectElement.addEventListener("change", function(event) {
    if (event.target.value === "Đăng xuất") {
        setTimeout(() => {
            if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang hay không?")) {
                event.target.value = "Tài khoản";
            } else {
                localStorage.removeItem("acount");
                window.location.href = "../pages/login.html";
            }
        }, 0);
    }
});

let valueMonth;
monthElement.addEventListener("change", function(){
    valueMonth = monthElement.value;
});

moneyEmpty.style.display = "none";
btnSave.addEventListener("click", function(){
    let valueMoney = inputMoney.value.trim();
    if(valueMoney === ""){
        textMoneyEmpty.textContent = "Dữ liệu không được để trống";
        moneyEmpty.style.display = "block";
        inputMoney.style.borderColor = "red";
        return;
    }
    else if(isNaN(valueMoney)){
        textMoneyEmpty.textContent = "Dữ liệu nhập vào không hợp lệ";
        moneyEmpty.style.display = "block";
        inputMoney.style.borderColor = "red";
        return;
    }
    else{
        moneyEmpty.style.display = "none";
        inputMoney.style.borderColor = "";
        inputMoney.value = "";
        money.textContent = Number(valueMoney).toLocaleString("vi-VN") + " VND";
        localStorage.setItem(`Money_${userId}`,valueMoney);
    }
});

btnAddCategory.addEventListener("click", function(){
    valueMonth = monthElement.value;
    if(!valueMonth){
        alert("Bạn chưa chọn tháng");
        return;
    }
    let valueNameCategory = nameCategory.value.trim();
    let valueLimitMoney = limit.value.trim();
    if(valueMonth === ""){
        alert("Bạn chưa chọn tháng");
        return;
    }
    if(valueNameCategory === ""){
        alert("Tên công việc không được để trống");
        return;
    }
    else if(valueLimitMoney === ""){
        alert("Số tiền giới hạn của danh mục không được để trống");
        return;
    }
    else if(isNaN(valueLimitMoney)){
        alert("Dữ liệu nhập không hợp lệ");
        return;
    }
    if(typeAddOrSave === "add"){
        let exisMonth = monthlyCategories.find(month => month.month === valueMonth);
        let exisCategory = monthlyCategories.find(categories => categories.categories.name === valueNameCategory);

        if(exisMonth){
            if(exisCategory){
                exisMonth.categories.push({
                    id : exisCategory.id,
                    name : valueNameCategory,
                    limit : valueLimitMoney
                });
            }
            else{
                count++;
                exisMonth.categories.push({
                    id : count,
                    name : valueNameCategory,
                    limit : valueLimitMoney
                });
            }
        }
        else{
            if(exisCategory){
                let objCategory = {
                    month : valueMonth,
                    categories : [
                        {
                            id : exisCategory.id,
                            name : valueNameCategory,
                            limit : valueLimitMoney
                        }
                    ]
                };
                monthlyCategories.push(objCategory);
            }
            else{
                count++;
                let objCategory = {
                    month : valueMonth,
                    categories : [
                        {
                            id : count,
                            name : valueNameCategory,
                            limit : valueLimitMoney
                        }
                    ]
                };
                monthlyCategories.push(objCategory);
            }

        }
        
        renderCategory();
        localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));

    }
    else{
        if(editMonthIndex !== -1 && editCategoryIndex !== -1){
            monthlyCategories[editMonthIndex].categories[editCategoryIndex].name = valueNameCategory;
            monthlyCategories[editMonthIndex].categories[editCategoryIndex].limit = valueLimitMoney;
            typeAddOrSave = "add";
            btnAddCategory.textContent = "Thêm danh mục";
            editMonthIndex = -1;
            editCategoryIndex = -1;
        }
    }
    localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
    renderData();
    nameCategory.value = "";
    limit.value = "";
    monthElement.value = "";
});

function renderData() {
    let htmls = monthlyCategories.map((valueMonth, indexMonth) => {
        return valueMonth.categories.map((categories,indexCategories) => {
            return `
                <div class="text-money">
                    <p>${categories.name} - Giới hạn: ${Number(categories.limit).toLocaleString("vi-VN") + " VND"}</p>
                    <div>
                        <button onclick="handleEdit(${indexMonth}, ${indexCategories})" id="btn-edit">Sửa</button>
                        <button onclick="handleDelete(${indexMonth}, ${indexCategories})" id="btn-delete">Xoá</button>
                    </div>
                </div>
            `
        }).join("");
    });

    let convert = htmls.join("");
    expenditure.innerHTML = convert;
}

renderData();
renderCategory();
renderTransactions();

function handleEdit(indexMonth, indexCategories){
    editMonthIndex = indexMonth;
    editCategoryIndex = indexCategories;
    nameCategory.value = monthlyCategories[indexMonth].categories[indexCategories].name;
    limit.value = monthlyCategories[indexMonth].categories[indexCategories].limit;
    btnAddCategory.textContent = 'Save';
    typeAddOrSave = "save";
}

function handleDelete(indexMonth, indexCategories){
    if(confirm("Bạn có chắc chắn muốn xoá danh mục này không")){
        monthlyCategories[indexMonth].categories.splice(indexCategories, 1);
        localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
        renderData();
    }   
}

let valueSelectMoney;
selectMoney.addEventListener("change", function(event){
    valueSelectMoney = event.target.value;
})

addMoney.addEventListener("click", function() {
    let valueMoneySpend = inputMoneySpend.value.trim();
    let valueNote = note.value.trim();
    let selectedCategory = selectMoney.value; 
    if (valueMoneySpend === "" || isNaN(valueMoneySpend)) {
        alert("Số tiền nhập vào không hợp lệ!");
        return;
    }
    if (!selectedCategory) {
        alert("Bạn chưa chọn danh mục!");
        return;
    }

    let objTransactions = {
        id : transactions.length + 1,
        userId : 1,
        month : valueMonth,
        categoryId : 1, 
        amount : valueMoneySpend,
        note : valueNote,
        categoryTransaction : selectedCategory
    };

    transactions.push(objTransactions);
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
    renderTransactions();

    inputMoneySpend.value = "";
    note.value = "";
});

function renderCategory() {
    let uniqueCategories = [];
    if(monthlyCategories.length === 0){
        let htmlCategory = "Tiền chi tiêu";
        selectMoney.innerHTML = htmlCategory;
    }
    else{
        monthlyCategories.map(month => {
            month.categories.map(category => {
                if (!uniqueCategories.includes(category.name)) {
                    uniqueCategories.push(category.name);
                }
            });
        });
    
        let htmlCategory = uniqueCategories.map(categoryName => 
            `<option value="${categoryName}">${categoryName}</option>`
        );
    
        let convert = htmlCategory.join("");
        selectMoney.innerHTML = convert;
    }

}   

function renderTransactions(){
    if (transactions.length === 0) {
        containerTransactionContent.innerHTML = "<br> <p> Không có giao dịch nào!</p>";
        return;
    }

    const getStar = (currentPage - 1) * totalPerPage;
    const getEnd = totalPerPage * currentPage;
    const transactionSlice = transactions.slice(getStar,getEnd);


    let htmlTransaction =  transactionSlice.map((value,index) => {
        return `
            <div class="transaction-content">
                <p>${value.categoryTransaction} - ${value.note}: ${Number(value.amount).toLocaleString("vi-VN") + " VND"}</p>
                <div>
                    <button onclick = "handleDeleteTransaction(${index})" id="btn-delete-transaction">Xoá</button>
                </div>
            </div>
        `
    });
    let convert = htmlTransaction.join("");
    containerTransactionContent.innerHTML = convert;
}

function handleDeleteTransaction(index) {
    if (confirm("Bạn có chắc chắn muốn xoá giao dịch này không?")) {
        transactions.splice(index, 1);
        localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
        renderTransactions();
    }
}

btnSearch.addEventListener("click", function(){
    let valueInputContent = inputContent.value.trim();
    filterTransactions(valueInputContent);
});

function filterTransactions(valueInputContent) {
    filteredTransactions = transactions.filter((value) => 
        value.categoryTransaction.includes(valueInputContent)
    );
    localStorage.setItem(`filterTransactions_${userId}`, JSON.stringify(filteredTransactions));

    let htmlTransaction = filteredTransactions.map((value, index) => {
        return `
            <div class="transaction-content">
                <p>${value.categoryTransaction} - ${value.note}: ${Number(value.amount).toLocaleString("vi-VN") + " VND"}</p>
                <div>
                    <button onclick="handleDeleteTransactionHistory(${index})" id="btn-delete-transaction">Xoá</button>
                </div>
            </div>
        `;
    });

    let convert = htmlTransaction.join("");
    containerTransactionContent.innerHTML = convert;
}

function handleDeleteTransactionHistory(index) {
    if (confirm("Bạn có chắc chắn muốn xoá giao dịch này không?")) {
        let valueInputContent = inputContent.value.trim(); 
        let transactionDelete = transactions.findIndex(
            (transaction) => transaction.categoryTransaction === filteredTransactions[index].categoryTransaction 
        );
        if(transactionDelete !== -1){
            transactions.splice(transactionDelete, 1);
            localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
        }
    
        if(valueInputContent){
            filterTransactions(valueInputContent); 
        } 
        else{
            renderTransactions(); 
        }
    }
}


selectPrice.addEventListener("change", function(event){
    let valueSelectPrice = event.target.value;
    let valueInputContent = inputContent.value.trim();
    if(valueInputContent){
        if(valueSelectPrice === "Tăng dần"){
            renderCategoryIncresePrice(filteredTransactions);
            let htmlTransaction = filteredTransactions.map((value, index) => {
                return `
                    <div class="transaction-content">
                        <p>${value.categoryTransaction} - ${value.note}: ${Number(value.amount).toLocaleString("vi-VN") + " VND"}</p>
                        <div>
                            <button onclick="handleDeleteTransactionHistory(${index})" id="btn-delete-transaction">Xoá</button>
                        </div>
                    </div>
                `;
            });
            let convert = htmlTransaction.join("");
            containerTransactionContent.innerHTML = convert;
            localStorage.setItem(`filterTransactions_${userId}`, JSON.stringify(filteredTransactions));

        }
        else if(valueSelectPrice === "Giảm dần"){
            renderCategoryDecresePrice(filteredTransactions);
            let htmlTransaction = filteredTransactions.map((value, index) => {
                return `
                    <div class="transaction-content">
                        <p>${value.categoryTransaction} - ${value.note}: ${Number(value.amount).toLocaleString("vi-VN") + " VND"}</p>
                        <div>
                            <button onclick="handleDeleteTransactionHistory(${index})" id="btn-delete-transaction">Xoá</button>
                        </div>
                    </div>
                `;
            });
            let convert = htmlTransaction.join("");
            containerTransactionContent.innerHTML = convert;
            localStorage.setItem(`filterTransactions_${userId}`, JSON.stringify(filteredTransactions));

        }
    }
    else{
        if(valueSelectPrice === "Tăng dần"){
            renderCategoryIncresePrice(transactions);
            renderTransactions()
            localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));

        }
        else if(valueSelectPrice === "Giảm dần"){
            renderCategoryDecresePrice(transactions);
            renderTransactions()
            localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
        }
    }
});

function renderCategoryIncresePrice(arr){
    arr.sort((a, b) => a.amount - b.amount);
}

function renderCategoryDecresePrice(arr){
    arr.sort((a, b) => b.amount - a.amount);
}

const renderPage = () => {
    btnPageElement.textContent = "";
    for(let i = 1; i <= totalPage; i++){
        const btnElement = document.createElement("button");
        btnElement.textContent = i;

        if(currentPage === i){
            btnElement.classList.add("btn-active");
        }

        if(currentPage === 1){
            document.querySelector("#btn-previous").setAttribute("disabled", "disabled");
        }
        else{
            document.querySelector("#btn-previous").removeAttribute("disabled");
    
        }
    
        if(currentPage === totalPage){
            document.querySelector("#btn-next").setAttribute("disabled", "disabled");
        }
        else{
            document.querySelector("#btn-next").removeAttribute("disabled");
        }

        console.log("currentPage:", currentPage);
        console.log("totalPage:", totalPage);

        btnElement.addEventListener("click", function() {
            currentPage = i;
            renderPage();
            renderTransactions();
        });
        btnPageElement.appendChild(btnElement);
    }


};

btnNext.addEventListener("click", function() {
    if(currentPage < totalPage){
        currentPage++;
        renderPage();
        renderTransactions();
    }

});

btnPrev.addEventListener("click", function() {
    if(currentPage > 1){
        currentPage--;
        renderPage();
        renderTransactions();
    }


});

renderPage();
renderTransactions();