    /* ========================================================
       5. PHÂN HỆ KHÁCH HÀNG: ĐĂNG NHẬP, ĐĂNG KÝ, PROFILE
       ======================================================== */
    function renderAuthNav() {
      const user = getCurrentUser();
      const div = document.getElementById("auth-links");
      if (user) {
        div.innerHTML = `
          <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-profile"]' data-js-event="click">
            <i class="fa-solid fa-circle-user"></i> Xin chào, <strong>${user.fullName || user.username}</strong>
          </a>
          <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-order-history"]' data-js-event="click">Đơn mua</a>
          <button data-js-action="clientLogout" data-js-args="[]" data-js-event="click"><i class="fa-solid fa-arrow-right-from-bracket"></i> Thoát</button>
        `;
      } else {
        div.innerHTML = `
          <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-auth"]' data-js-event="click">
            <i class="fa-solid fa-user"></i> Đăng nhập / Đăng ký
          </a>
        `;
      }
    }

    function switchAuthTab(tab) {
      const loginBtn = document.getElementById("tab-btn-login");
      const regBtn = document.getElementById("tab-btn-register");
      const loginBlock = document.getElementById("form-login-block");
      const regBlock = document.getElementById("form-register-block");

      if (tab === 'login') {
        loginBtn.classList.add("active");
        regBtn.classList.remove("active");
        loginBlock.style.display = "block";
        regBlock.style.display = "none";
      } else {
        regBtn.classList.add("active");
        loginBtn.classList.remove("active");
        regBlock.style.display = "block";
        loginBlock.style.display = "none";
      }
    }

    function executeClientLogin() {
      const u = document.getElementById("auth-login-user").value.trim();
      const p = document.getElementById("auth-login-pass").value.trim();

      const users = getUsers();
      const found = users.find(x => x.username === u && x.password === p);

      if (!found) {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
        return;
      }
      if (found.isLocked) {
        alert("Tài khoản của bạn đã bị KHÓA bởi ban quản trị!");
        return;
      }

      setCurrentUser(found);
      alert("Đăng nhập thành công!");
      navigateTo('view-home');
    }

    function executeClientRegister() {
      const u = document.getElementById("auth-reg-user").value.trim();
      const p = document.getElementById("auth-reg-pass").value.trim();
      const name = document.getElementById("auth-reg-name").value.trim();
      const phone = document.getElementById("auth-reg-phone").value.trim();
      const address = document.getElementById("auth-reg-address").value.trim();

      if (!u || !p || !name) {
        alert("Vui lòng điền tài khoản, mật khẩu và họ tên!");
        return;
      }

      const users = getUsers();
      if (users.some(x => x.username === u)) {
        alert("Tên tài khoản này đã được sử dụng!");
        return;
      }

      const newUser = {
        username: u,
        password: p,
        fullName: name,
        phone: phone,
        address: address,
        isLocked: false
      };
      users.push(newUser);
      setUsers(users);

      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      switchAuthTab('login');
      document.getElementById("auth-login-user").value = u;
    }

    function clientLogout() {
      setCurrentUser(null);
      alert("Đã đăng xuất tài khoản.");
      navigateTo('view-home');
    }

    function loadProfile() {
      const user = getCurrentUser();
      if (!user) return;
      document.getElementById("prof-username").value = user.username;
      document.getElementById("prof-fullname").value = user.fullName || "";
      document.getElementById("prof-phone").value = user.phone || "";
      document.getElementById("prof-address").value = user.address || "";
    }

    function saveProfileChanges() {
      const user = getCurrentUser();
      if (!user) return;

      user.fullName = document.getElementById("prof-fullname").value.trim();
      user.phone = document.getElementById("prof-phone").value.trim();
      user.address = document.getElementById("prof-address").value.trim();

      let users = getUsers();
      const idx = users.findIndex(u => u.username === user.username);
      if (idx !== -1) {
        users[idx] = user;
        setUsers(users);
      }
      setCurrentUser(user);
      alert("Cập nhật thông tin cá nhân thành công!");
    }


