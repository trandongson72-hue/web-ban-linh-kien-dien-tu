"use strict";

const SP = [
  { id: 'TN01', ten: 'Tai nghe Bluetooth G1',  loai: 'Tai nghe',   gia: 450000 },
  { id: 'TN02', ten: 'Tai nghe chụp tai H2',   loai: 'Tai nghe',   gia: 890000 },
  { id: 'DT01', ten: 'Điện thoại Galaxy X',    loai: 'Điện thoại', gia: 12990000 },
  { id: 'DT02', ten: 'Điện thoại Phone Lite',  loai: 'Điện thoại', gia: 4990000 },
  { id: 'LT01', ten: 'Laptop Pro 14"',         loai: 'Laptop',     gia: 22500000 },
  { id: 'LT02', ten: 'Laptop Study 15"',       loai: 'Laptop',     gia: 13900000 },
  { id: 'PK01', ten: 'Sạc nhanh 65W',          loai: 'Phụ kiện',   gia: 350000 },
  { id: 'PK02', ten: 'Cáp USB-C 1m',           loai: 'Phụ kiện',   gia: 90000 }
];

const NHAP = [
  ['2026-09-01','TN01',30], ['2026-09-01','TN02',15], ['2026-09-01','DT01',10],
  ['2026-09-01','DT02',20], ['2026-09-01','LT01',8],  ['2026-09-01','LT02',12],
  ['2026-09-01','PK01',40], ['2026-09-01','PK02',60],
  ['2026-10-10','DT01',5],  ['2026-10-12','TN01',20]
].map(([ngay, sp, sl]) => ({ ngay, sp, sl }));

const DON0 = [
  { id: 'DH001', ngay: '2026-10-02', kh: 'Nguyễn Văn An',   tt: 'Đã giao',  ds: [['TN01',2],['PK02',3]] },
  { id: 'DH002', ngay: '2026-10-05', kh: 'Trần Thị Bình',   tt: 'Đã giao',  ds: [['DT01',4]] },
  { id: 'DH003', ngay: '2026-10-08', kh: 'Lê Hoàng',        tt: 'Đã xử lý', ds: [['LT01',6]] },
  { id: 'DH004', ngay: '2026-10-11', kh: 'Phạm Dũng',       tt: 'Hủy',      ds: [['DT02',3]] },
  { id: 'DH005', ngay: '2026-10-15', kh: 'Võ Thị Mai',      tt: 'Đã giao',  ds: [['TN02',10]] },
  { id: 'DH006', ngay: '2026-10-20', kh: 'Đặng Khoa',       tt: 'Đã xử lý', ds: [['DT01',5],['PK01',2]] },
  { id: 'DH007', ngay: '2026-10-24', kh: 'Hồ Thị Lan',      tt: 'Mới đặt',  ds: [['LT02',2],['TN01',4]] },
  { id: 'DH008', ngay: '2026-10-25', kh: 'Bùi Quốc Nam',    tt: 'Đã xử lý', ds: [['PK01',36]] }
];

const XUAT_TT = ['Đã xử lý', 'Đã giao'];
const MAU = { 'Mới đặt': 'moi', 'Đã xử lý': 'xl', 'Đã giao': 'giao', 'Hủy': 'huy' };
const KEY = 'dientu_don_hang';

const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const tim = id => SP.find(p => p.id === id);
const homNay = new Date().toISOString().slice(0, 10);

function docDon() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {}
  return JSON.parse(JSON.stringify(DON0));
}
function luuDon() { try { localStorage.setItem(KEY, JSON.stringify(DON)); } catch (e) {} }

let DON = docDon();
let dangMo = null;

const tongTien = o => o.ds.reduce((s, [p, n]) => s + tim(p).gia * n, 0);

function timDon() {
  const tu = $('d-tu').value, den = $('d-den').value, tt = $('d-tt').value;
  const kq = DON.filter(o => (!tu || o.ngay >= tu) && (!den || o.ngay <= den) && (!tt || o.tt === tt));
  $('d-body').innerHTML = kq.length ? kq.map(o => `
    <tr>
      <td>${o.id}</td><td>${o.ngay}</td><td>${o.kh}</td><td>${fmt(tongTien(o))}</td>
      <td><span class="tag ${MAU[o.tt]}">${o.tt}</span></td>
      <td><button class="btn phu" onclick="moDon('${o.id}')">Chi tiết</button></td>
    </tr>`).join('')
    : '<tr><td colspan="6">Không có đơn hàng phù hợp</td></tr>';
}

function xoaLoc() { $('d-tu').value = ''; $('d-den').value = ''; $('d-tt').value = ''; timDon(); }

function moDon(id) {
  const o = DON.find(x => x.id === id);
  dangMo = id;
  $('m-title').textContent = `Đơn ${o.id} – ${o.kh} (${o.ngay})`;
  $('m-body').innerHTML = o.ds.map(([p, n]) => `
    <tr><td>${p}</td><td>${tim(p).ten}</td><td>${n}</td><td>${fmt(tim(p).gia)}</td><td>${fmt(tim(p).gia * n)}</td></tr>`).join('')
    + `<tr><td colspan="4"><b>Tổng cộng</b></td><td><b>${fmt(tongTien(o))}</b></td></tr>`;
  $('m-tt').value = o.tt;
  const khoa = o.tt === 'Đã giao' || o.tt === 'Hủy';
  $('m-tt').disabled = khoa; $('m-luu').disabled = khoa;
  $('m-ghi').textContent = khoa ? 'Đơn đã kết thúc, không thể đổi tình trạng.' : '';
  $('modal').classList.add('mo');
}

function capNhat() {
  const o = DON.find(x => x.id === dangMo);
  o.tt = $('m-tt').value;
  luuDon(); timDon(); dong();
}
function dong() { $('modal').classList.remove('mo'); }

function dsXuat() {
  return DON.filter(o => XUAT_TT.includes(o.tt))
            .flatMap(o => o.ds.map(([sp, sl]) => ({ ngay: o.ngay, sp, sl })));
}

const cong = (list, id, ok) => list.filter(x => x.sp === id && ok(x.ngay)).reduce((s, x) => s + x.sl, 0);

function timTon() {
  const ngay = $('k-ngay').value || homNay, loai = $('k-loai').value, X = dsXuat();
  const ng = Number($('k-nguong').value) || 0;
  $('k-body').innerHTML = SP.filter(p => !loai || p.loai === loai).map(p => {
    const n = cong(NHAP, p.id, d => d <= ngay), x = cong(X, p.id, d => d <= ngay), ton = n - x;
    return `<tr class="${ton <= ng ? 'thap' : ''}"><td>${p.id}</td><td>${p.ten}</td><td>${p.loai}</td><td>${n}</td><td>${x}</td><td>${ton}</td></tr>`;
  }).join('');
}

function canhBao() {
  const ng = Number($('k-nguong').value) || 0, X = dsXuat();
  const ds = SP.map(p => ({ p, ton: cong(NHAP, p.id, d => d <= homNay) - cong(X, p.id, d => d <= homNay) }))
               .filter(r => r.ton <= ng);
  $('k-canhbao').innerHTML = ds.length
    ? ds.map(r => `<div class="canh">⚠️ ${r.p.id} – ${r.p.ten}: chỉ còn <b>${r.ton}</b></div>`).join('')
    : '<div class="ok">✅ Không có sản phẩm nào sắp hết hàng.</div>';
}

function timNXT() {
  const id = $('n-sp').value, tu = $('n-tu').value, den = $('n-den').value;
  if (!tu || !den || tu > den) { alert('Vui lòng chọn khoảng thời gian hợp lệ (từ ngày ≤ đến ngày).'); return; }
  const X = dsXuat();
  const dau = cong(NHAP, id, d => d < tu) - cong(X, id, d => d < tu);
  const n = cong(NHAP, id, d => d >= tu && d <= den), x = cong(X, id, d => d >= tu && d <= den);
  $('n-body').innerHTML = `<tr><td>${tim(id).ten}</td><td>${dau}</td><td>${n}</td><td>${x}</td><td><b>${dau + n - x}</b></td></tr>`;
}

function hien(t) {
  document.querySelectorAll('.tab').forEach(e => e.classList.toggle('on', e.id === t));
  document.querySelectorAll('.menu button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  if (t === 'kho') { timTon(); canhBao(); } else timDon();
}

const loais = [...new Set(SP.map(p => p.loai))];
$('k-loai').innerHTML = '<option value="">Tất cả loại</option>' + loais.map(l => `<option>${l}</option>`).join('');
$('n-sp').innerHTML = SP.map(p => `<option value="${p.id}">${p.id} – ${p.ten}</option>`).join('');
$('k-ngay').value = homNay;
$('n-tu').value = '2026-10-01';
$('n-den').value = homNay;
timDon();
