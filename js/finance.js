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
let totalPerPage = 3;
let totalPage = Math.ceil(transactions.length/totalPerPage);
let btnPageElement = document.querySelector("#btn-page");
let btnPrev = document.querySelector("#btn-previous");
let btnNext = document.querySelector("#btn-next");

let excessFoodExpenses = document.querySelector(".excess-food-expenses");
let arrCategoryBudget = JSON.parse(localStorage.getItem(`moneyOverLimit_${userId}`)) || [];
let monthlReports = JSON.parse(localStorage.getItem(`monthlReports_${userId}`)) || [];

let table = document.querySelector("#table");
let tbody = document.querySelector("#tbody");


// Đăng xuất
selectElement.addEventListener("change", function(event) {
    if(event.target.value === "Đăng xuất") {
        setTimeout(() => {
            if(!confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang hay không?")){
                event.target.value = "Tài khoản";
            } 
            else{
                localStorage.removeItem("acount");
                window.location.href = "../pages/login.html";
            }
        }, 0);
    }
});

// Chọn tháng chi tiêu
let currentMonth;
monthElement.addEventListener("change", function() {
    currentMonth = monthElement.value;
    renderMoney();
    renderData();
    renderTransactions();
    renderPage();
    checkCategoryBudget();
    renderCheckCategoryBudget();
    renderCategory();
});


//Nhập ngân sách tháng
moneyEmpty.style.display = "none";
let valueMoney;
btnSave.addEventListener("click", function() {
    if (!currentMonth) { 
        Swal.fire({
            title: "Bạn chưa nhập tháng",
            icon: "question"
        });
        return;
    }

    let valueMoney = inputMoney.value.trim();
    if(!valueMoney){
        textMoneyEmpty.textContent = "Dữ liệu không được để trống";
        moneyEmpty.style.display = "block";
        inputMoney.style.borderColor = "red";
        return;
    } 
    else if(isNaN(valueMoney) || valueMoney < 0) {
        textMoneyEmpty.textContent = "Dữ liệu nhập vào không hợp lệ";
        moneyEmpty.style.display = "block";
        inputMoney.style.borderColor = "red";
        return;
    } 
    else{
        moneyEmpty.style.display = "none";
        inputMoney.style.borderColor = "";
        inputMoney.value = "";

        let monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
        let currentMonthData = monthlyCategories.find(month => month.month === currentMonth);

        if (!currentMonthData) {
            currentMonthData = {
                id : monthlyCategories.length + 1,
                month: currentMonth,
                amount: Number(valueMoney),
                monthlyBudget : Number(valueMoney),
                categories: []
            };
            monthlyCategories.push(currentMonthData);
        }
        else{
            currentMonthData.amount += Number(valueMoney);
            currentMonthData.monthlyBudget += Number(valueMoney);
        }

        localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
        localStorage.setItem(`Money_${userId}`, valueMoney); 

        money.textContent = Number(valueMoney).toLocaleString("vi-VN") + " VND";
        renderMoney();
        renderTableStatistical();
    }
});


//Sự kiện thêm danh mục
btnAddCategory.addEventListener("click", function() {
    if (!currentMonth) {
        Swal.fire({
            title: "Bạn chưa nhập tháng",
            icon: "question"
        });
        return;
    }
    let valueNameCategory = nameCategory.value.trim().charAt(0).toUpperCase() + nameCategory.value.trim().slice(1);
    let valueLimitMoney = limit.value.trim();

    if(valueNameCategory === ""){
        Swal.fire({
            title: "Bạn chưa nhập tên danh mục",
            icon: "question"
        });
        return;
    } 
    else if(!valueLimitMoney){
        Swal.fire({
            title: "Bạn chưa nhập giới hạn chi tiêu",
            icon: "question"
        });
        return;
    } 
    else if(isNaN(valueLimitMoney) || valueLimitMoney < 0){
        Swal.fire({
            icon: "error",
            title: "Cảnh báo",
            text: "Dữ liệu nhập không hợp lệ",
        });
        return;
    }

    monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
    let currentMonthData = monthlyCategories.find(month => month.month === currentMonth);

    if (!currentMonthData) {
        Swal.fire({
            title: "Bạn chưa thiết lập số tiền cho tháng này",
            icon: "warning"
        });
        return;
    }

    if (typeAddOrSave === "add") {
        let exisCategory = currentMonthData.categories.find(cat => cat.name === valueNameCategory);
        if(exisCategory) {
            Swal.fire({
                icon: "warning",
                title: "Cảnh báo",
                text: "Danh mục đã tồn tại",
            });
            return;
        } 
        else{
            count++;
            currentMonthData.categories.push({
                id: count,
                name: valueNameCategory,
                budget: valueLimitMoney
            });
        }
        renderCategory();
        localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
    } 
    else{
        if(editMonthIndex !== -1 && editCategoryIndex !== -1) {
            monthlyCategories[editMonthIndex].categories[editCategoryIndex].name = valueNameCategory;
            monthlyCategories[editMonthIndex].categories[editCategoryIndex].budget = valueLimitMoney;
            typeAddOrSave = "add";
            btnAddCategory.textContent = "Thêm danh mục";
            editMonthIndex = -1;
            editCategoryIndex = -1;
        }
    }

    localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
    renderData();
    renderTransactions(); 
    renderPage();     
    checkCategoryBudget();
    renderCheckCategoryBudget();
    renderMoney();
    renderCategory();
    nameCategory.value = "";
    limit.value = "";
});

// Hàm render dữ liệu danh mục
function renderData() {
    let currentMonthData = monthlyCategories.find(month => month.month === currentMonth);
    
    if(!currentMonthData) {
        expenditure.innerHTML = "<p>Không có dữ liệu cho tháng này.</p>";
        return;
    }

    let htmls = currentMonthData.categories.map((category, index) => {
        return `
            <div class="text-money">
                <p>${category.name} - Giới hạn: ${Number(category.budget).toLocaleString("vi-VN") + " VND"}</p>
                <div>
                    <button onclick="handleEdit(${monthlyCategories.indexOf(currentMonthData)}, ${index})" id="btn-edit">Sửa</button>
                    <button onclick="handleDelete(${monthlyCategories.indexOf(currentMonthData)}, ${index})" id="btn-delete">Xoá</button>
                </div>
            </div>
        `;
    });

    let convert = htmls.join("");
    expenditure.innerHTML = convert;
}

renderData();
renderCategory();
renderTransactions();
checkCategoryBudget();


// Hàm chỉnh sửa danh mục
function handleEdit(indexMonth, indexCategories){
    editMonthIndex = indexMonth;
    editCategoryIndex = indexCategories;
    nameCategory.value = monthlyCategories[indexMonth].categories[indexCategories].name;
    limit.value = monthlyCategories[indexMonth].categories[indexCategories].limit;
    btnAddCategory.textContent = 'Save';
    typeAddOrSave = "save";
}

//Hàm xoá danh mục
function handleDelete(indexMonth, indexCategories){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          monthlyCategories[indexMonth].categories.splice(indexCategories, 1);
          localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));
          renderData();
        }
      });
}

//Chọn danh mục cần chi tiêu
let valueSelectMoney;
selectMoney.addEventListener("change", function(event){
    valueSelectMoney = event.target.value;
})

//Nhập số tiền cần chi tiêu cho danh mục
addMoney.addEventListener("click", function() {
    if (!currentMonth) {
        Swal.fire({
            title: "Bạn chưa nhập tháng",
            icon: "question"
        });
        return;
    }
    let valueMoneySpend = inputMoneySpend.value.trim();
    let valueNote = note.value.trim();
    let selectedCategory = selectMoney.value;

    if (!valueMoneySpend || isNaN(valueMoneySpend) || Number(valueMoneySpend) <= 0) {
        Swal.fire({
            icon: "error",
            title: "Cảnh báo",
            text: "Số tiền nhập vào không hợp lệ",
        });
        return;
    }
    if (!selectedCategory) {
        Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn chưa chọn danh mục",
        });
        return;
    }
    if (!valueNote) {
        Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn chưa viết ghi chú",
        });
        return;
    }

    let monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
    let currentMonthData = monthlyCategories.find(month => month.month === currentMonth);

    if(!currentMonthData || currentMonthData.amount === undefined){
        Swal.fire({
            icon: "error",
            title: "Cảnh báo",
            text: "Chưa thiết lập số tiền cho tháng này!",
        });
        return;
    }

    let amountSpend = Number(valueMoneySpend);

    let objTransactions = {
        id: transactions.length + 1,
        userId: 1,
        month: currentMonth,
        categoryId: 1,
        amount: valueMoneySpend,
        note: valueNote,
        categoryTransaction: selectedCategory
    };

    transactions.push(objTransactions);
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));

    currentMonthData.amount -= amountSpend;
    localStorage.setItem(`monthlyCategories_${userId}`, JSON.stringify(monthlyCategories));

    renderMoney();
    renderTransactions();
    renderPage();
    inputMoneySpend.value = "";
    note.value = "";
    checkCategoryBudget();
    renderCheckCategoryBudget();
    renderTableStatistical();
});

// Hàm rander những danh mục cần chọn
function renderCategory() {
    let htmlCategory = "";
    if(!currentMonth){
        htmlCategory = "<option value=''>Tiền chi tiêu</option>";
    } 
    else{
        let currentMonthData = monthlyCategories.find(month => month.month === currentMonth);
        if (currentMonthData && currentMonthData.categories.length > 0) {
            htmlCategory = currentMonthData.categories.map(category => 
                `<option value="${category.name}">${category.name}</option>`
            ).join("");
        } else {
            htmlCategory = "<option value=''>Tiền chi tiêu</option>";
        }
    }
    selectMoney.innerHTML = htmlCategory;
}

//Hàm render danh mục lịch sử chi tiêu
function renderTransactions() {
    let currentTransactions = transactions.filter(transaction => transaction.month === currentMonth);
    
    if (currentTransactions.length === 0) {
        containerTransactionContent.innerHTML = "<br> <p>Không có giao dịch nào!</p>";
        return;
    }

    let getStart = (currentPage - 1) * totalPerPage;
    let getEnd = totalPerPage * currentPage;
    let transactionSlice = currentTransactions.slice(getStart, getEnd);

    let htmlTransaction = transactionSlice.map((value, index) => {
        return `
            <div class="transaction-content">
                <p>${value.categoryTransaction} - ${value.note}: ${Number(value.amount).toLocaleString("vi-VN") + " VND"}</p>
                <div>
                    <button onclick="handleDeleteTransaction(${index})" id="btn-delete-transaction">Xoá</button>
                </div>
            </div>
        `;
    });

    containerTransactionContent.innerHTML = htmlTransaction.join("");
}

//Hàm xoá danh mục ở phần lịch sử
function handleDeleteTransaction(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          transactions.splice(index, 1);
          localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
          renderTransactions();
        }
      });
}

//Sự kiện tìm kiếm
btnSearch.addEventListener("click", function(){
    let valueInputContent = inputContent.value.trim().charAt(0).toUpperCase() + inputContent.value.trim().slice(1).toLowerCase();
    if(!valueInputContent){
        return;
    }
    else{
        filterTransactions(valueInputContent);
    }
});


//Hàm lọc danh mục của lịch sử
function filterTransactions(valueInputContent) {
    filteredTransactions = transactions.filter((value) => 
        value.categoryTransaction.includes(valueInputContent)
    );
    localStorage.setItem(`filterTransactions_${userId}`, JSON.stringify(filteredTransactions));

    let currentTransactions = filteredTransactions.filter(transaction => transaction.month === currentMonth);
    totalPage = Math.ceil(currentTransactions.length / totalPerPage);
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
    renderPage();
}

//Hàm xoá danh mục lịch sử
function handleDeleteTransactionHistory(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
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
          renderPage();
        }
      });

}

//Hàm chọn sắp xếp danh mục theo giá tiền
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

//Hàm sắp xếp
function renderCategoryIncresePrice(arr){
    arr.sort((a, b) => a.amount - b.amount);
}

function renderCategoryDecresePrice(arr){
    arr.sort((a, b) => b.amount - a.amount);
}


//Hàm render các nút phân trang
let renderPage = () => {
    let currentTransactions = transactions.filter(transaction => transaction.month === currentMonth);
    totalPage = Math.ceil(currentTransactions.length / totalPerPage);
    btnPageElement.textContent = "";

    for(let i = 1; i <= totalPage; i++){
        let btnElement = document.createElement("button");
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


//Hàm kiểm tra các chi tiêu vượt quá giới hạn
function checkCategoryBudget() {
    // let excessFoodExpenses = document.querySelector(".excess-food-expenses"); 
    let currentMonthData = monthlyCategories.find(item => item.month === currentMonth);
    let newArrCategoryBudget = [];

    if (currentMonthData) {
        currentMonthData.categories.forEach(category => {
            let categoryName = category.name;
            let categoryBudget = Number(category.budget);
            let totalSpentForCategory = 0;

            transactions.forEach(transaction => {
                if (transaction.month === currentMonth && transaction.categoryTransaction === categoryName) {
                    totalSpentForCategory += Number(transaction.amount);
                }
            });

            if (totalSpentForCategory > categoryBudget) {
                let message = `Danh mục '${categoryName}' đã vượt giới hạn: ${totalSpentForCategory.toLocaleString("vi-VN")} / ${categoryBudget.toLocaleString("vi-VN")} VND`;
                newArrCategoryBudget.push(message);
            }
        });
    }

    if (newArrCategoryBudget.length > 0) {
        arrCategoryBudget = newArrCategoryBudget;
    
    } else {
       
        arrCategoryBudget =  [];
    }
    localStorage.setItem(`moneyOverLimit_${userId}`, JSON.stringify(arrCategoryBudget));

    renderCheckCategoryBudget();
}


//Hàm render các danh mục vượt quá giới hạn
function renderCheckCategoryBudget() {
    excessFoodExpenses.innerHTML = ""; 

    if (arrCategoryBudget.length > 0) {
        arrCategoryBudget.forEach(message => {
            let p = document.createElement("p");
            p.textContent = message;
            excessFoodExpenses.appendChild(p);
        });
    } else {
        let p = document.createElement("p");
        p.textContent = "Không có danh mục nào chi tiêu vượt quá giới hạn trong tháng này.";
        excessFoodExpenses.appendChild(p);
    }
}
arrCategoryBudget = JSON.parse(localStorage.getItem(`moneyOverLimit_${userId}`)) || [];
renderCheckCategoryBudget();


//Load lại trang lấy dữ liệu từ tháng đầu tiên
if(monthlyCategories.length > 0){
    currentMonth = monthlyCategories[0].month;
    monthElement.value = currentMonth;
    renderMoney();
    renderData();
    renderTransactions();
    renderPage();
    checkCategoryBudget();
    renderCheckCategoryBudget();
    renderCategory();
} 
else{
    currentMonth = null;
    renderMoney();
}
renderData();
renderTransactions();
renderPage();
checkCategoryBudget();
renderCheckCategoryBudget();
renderMoney();
function renderMoney() {
    if (!currentMonth) {
        money.textContent = "0 VND";
        return;
    }
    let monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
    let monthData = monthlyCategories.find(m => m.month === currentMonth);

    
    if (!monthData) {
        money.textContent = "0 VND";
        money.classList.remove("moneyNegative");
        return;
    }


    if (monthData && monthData.amount > 0 && monthData.amount !== undefined) {
        money.textContent = (Number(monthData.amount).toLocaleString("vi-VN") + " VND");
        money.classList.remove("moneyNegative");
    } 
    else if(Number(monthData.amount) < 0){  
        money.classList.add("moneyNegative");
        money.textContent = (Number(monthData.amount).toLocaleString("vi-VN") + " VND");
    }
    else {
        money.textContent = "0 VND";
        money.classList.remove("moneyNegative");
    }
}

// Hàm render thống kê chi tiêu các tháng
function renderTableStatistical(){
    let totalMoneyCategorySpent = 0;
    let objMonthltRepor = {
        userId: currentUser.id,
        month: currentMonth,
        totalAmount: 0,
        details: []
    };
    let currentTransactions = transactions.filter(value => value.month === currentMonth);

    if (currentTransactions.length === 0) {
        tbody.innerHTML = "";
        return;
    }

    transactions.forEach((value) => {
        if(value.month === currentMonth) {
            totalMoneyCategorySpent += Number(value.amount);
            objMonthltRepor.details.push({
                categoryId: value.categoryId,
                amount: value.amount
            });
        }
    });

    objMonthltRepor.totalAmount = totalMoneyCategorySpent;
    monthlReports = monthlReports.filter(
        report => !(report.userId === currentUser.id && report.month === currentMonth)
    );
    monthlReports.push(objMonthltRepor);
    localStorage.setItem(`monthlReports_${userId}`,JSON.stringify(monthlReports));
    
    monthlyCategories = JSON.parse(localStorage.getItem(`monthlyCategories_${userId}`)) || [];
    let htmlReport = monthlReports.map((value) => {
        let findMonth = monthlyCategories.find(budget => budget.month === value.month);
        let budgetForMonth = findMonth ? findMonth.monthlyBudget : 0;
        let status = Number(value.totalAmount) <= Number(budgetForMonth)
            ? `<span style="color:green">✅ Đạt</span>`
            : `<span style="color:red">Vượt</span>`;
        return `
            <tr>
                <td>${value.month}</td>
                <td>${Number(value.totalAmount).toLocaleString("vi-VN")} VND</td>
                <td>${Number(budgetForMonth).toLocaleString("vi-VN")}</td>
                <td>${status}</td>
            </tr>
        `;
    });
    tbody.innerHTML = htmlReport.join("");

}

renderTableStatistical();

