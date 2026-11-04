/* ========================================================
   12. EVENT LISTENERS - GẮN SỰ KIỆN TRỰC TIẾP TỪNG PHẦN TỬ
   Các nút/điều khiển dùng data-js-action, data-js-args, data-js-event.
   Mỗi phần tử tự có addEventListener; không dùng event delegation.
   ======================================================== */
function viewClientOrderDetailById(orderId) {
  const order = getOrders().find(item => item.orderId === orderId);
  if (!order) {
    alert("Không tìm thấy thông tin đơn hàng.");
    return;
  }
  viewClientOrderDetail(order);
}

function removeDraftImportItem(index) {
  currentDraftImportItems.splice(Number(index), 1);
  renderDraftImportItemsTable();
}

function runDataAction(trigger, event) {
  const actionName = trigger.dataset.jsAction;
  let args = [];

  try {
    args = JSON.parse(trigger.dataset.jsArgs || "[]");
  } catch (error) {
    console.error("Không thể đọc tham số của action:", actionName, error);
    return;
  }

  args = args.map(value => {
    if (value === "$value") return trigger.value;
    if (value === "$checked") return trigger.checked;
    if (typeof value === "string" && value.startsWith("$raw:")) {
      console.warn("Tham số action chưa được chuyển đổi:", value);
      return undefined;
    }
    return value;
  });

  const action = window[actionName];
  if (typeof action !== "function") {
    console.warn(`Không tìm thấy hàm xử lý "${actionName}".`);
    return;
  }

  if (event.type === "click" && trigger.matches("a")) {
    event.preventDefault();
  }

  action(...args);

  // Sau khi hàm xử lý cập nhật giao diện bằng innerHTML, gắn listener
  // trực tiếp cho các phần tử mới được tạo. Không dùng event delegation.
  bindDataActionsIn(document);
}

const boundActionElements = new WeakSet();

function bindDataActionElement(element) {
  if (!(element instanceof Element)) return;
  if (!element.matches("[data-js-action]") || boundActionElements.has(element)) return;

  const eventName = element.dataset.jsEvent || "click";
  element.addEventListener(eventName, event => runDataAction(element, event));
  boundActionElements.add(element);
}

function bindDataActionsIn(root) {
  if (!(root instanceof Element || root instanceof Document)) return;

  if (root instanceof Element) bindDataActionElement(root);
  root.querySelectorAll?.("[data-js-action]").forEach(bindDataActionElement);
}

function initializeDataActionListeners() {
  // Gắn addEventListener trực tiếp lên từng phần tử hiện có.
  // Phần tử tạo động sẽ được gắn lại sau mỗi action và sau lần render khởi tạo.
  bindDataActionsIn(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDataActionListeners, { once: true });
} else {
  initializeDataActionListeners();
}
