// Tạo ID thành viên
if (!localStorage.getItem("memberId")) {
  const newId = "USER" + Math.floor(Math.random() * 1000000);
  localStorage.setItem("memberId", newId);
}
const memberId = localStorage.getItem("memberId");

// Lấy số dư
let members = JSON.parse(localStorage.getItem("members") || "{}");
if (!members[memberId]) members[memberId] = { balance: 0 };
localStorage.setItem("members", JSON.stringify(members));

function updateBalanceDisplay() {
  members = JSON.parse(localStorage.getItem("members"));
  document.getElementById("show-id").innerText = memberId;
  document.getElementById("balance").innerText = members[memberId].balance.toLocaleString();
}
updateBalanceDisplay();

// Danh sách sản phẩm
const products = [
  { id: 1, name: "Tool Facebook", price: 50000 },
  { id: 2, name: "Tool TikTok", price: 70000 },
  { id: 3, name: "Tool Instagram", price: 60000 },
];

const list = document.getElementById("product-list");
products.forEach(p => {
  const div = document.createElement("div");
  div.className = "col-md-4";
  div.innerHTML = `
    <div class="card p-3">
      <h5>${p.name}</h5>
      <p>Giá: ${p.price.toLocaleString()} VNĐ</p>
      <button class="btn btn-primary" onclick="buy(${p.id})">Mua</button>
    </div>
  `;
  list.appendChild(div);
});

// Mua tool
function buy(id) {
  const product = products.find(p => p.id === id);
  members = JSON.parse(localStorage.getItem("members"));
  if (members[memberId].balance >= product.price) {
    members[memberId].balance -= product.price;
    localStorage.setItem("members", JSON.stringify(members));
    alert("Mua thành công! Tool sẽ được gửi qua Telegram.");
    window.location.href = "https://t.me/haireal_ios";
  } else {
    alert("Bạn không đủ số dư.");
  }
  updateBalanceDisplay();
}

// Nạp tiền
function showRecharge() {
  const modal = new bootstrap.Modal(document.getElementById("qrModal"));
  document.getElementById("qr-code-text").innerText = "NAP " + memberId;
  const qrData = `Ngân hàng: Vietcombank\nSTK: 1048868033\nChủ TK: DAO DUC HAI\nNội dung: NAP ${memberId}`;
  QRCode.toCanvas(document.getElementById("qrCanvas"), qrData, function (err) {
    if (err) console.error(err);
  });
  modal.show();
}

// Admin
function showAdminLogin() {
  document.getElementById("admin-login").style.display = "block";
}

function loginAdmin() {
  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;
  if (user === "admin" && pass === "123456") {
    showAdmin();
  } else {
    alert("Sai tài khoản hoặc mật khẩu.");
  }
}

function showAdmin() {
  document.getElementById("admin-area").style.display = "block";
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  members = JSON.parse(localStorage.getItem("members"));
  Object.keys(members).forEach(id => {
    const div = document.createElement("div");
    div.className = "card mb-2";
    div.innerHTML = `
      <p><strong>${id}</strong> | Số dư: <span id="bal-${id}">${members[id].balance.toLocaleString()}</span> VNĐ</p>
      <input type="number" id="input-${id}" placeholder="Nhập số dư mới" class="form-control mb-2">
      <button class="btn btn-success btn-sm me-2" onclick="updateBalance('${id}')">Cập nhật</button>
      <button class="btn btn-danger btn-sm" onclick="deleteUser('${id}')">Xoá</button>
    `;
    list.appendChild(div);
  });
}

function updateBalance(id) {
  const val = document.getElementById("input-" + id).value;
  members[id].balance = parseInt(val);
  localStorage.setItem("members", JSON.stringify(members));
  document.getElementById("bal-" + id).innerText = members[id].balance.toLocaleString();
}

function deleteUser(id) {
  if (confirm("Bạn có chắc muốn xoá tài khoản này?")) {
    delete members[id];
    localStorage.setItem("members", JSON.stringify(members));
    showAdmin();
  }
}