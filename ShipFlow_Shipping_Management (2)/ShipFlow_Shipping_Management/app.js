const STORAGE_KEY = "shipflow_shipments_v1";
const seed = [
 {id:"SF-1001",recipient:"Nadia Putri",phone:"081234567801",address:"Jl. Margonda Raya No. 12, Depok",courier:"JNE",service:"Reguler",weight:1,shippingCost:18000,status:"Dalam pengiriman",trackingNumber:"JNE123456789",notes:"",createdAt:"2026-10-15",history:[{status:"Menunggu pickup",detail:"Pengiriman dibuat oleh admin",date:"2026-10-15 09:15"},{status:"Diproses",detail:"Paket disiapkan untuk diserahkan ke kurir",date:"2026-10-15 10:30"},{status:"Dalam pengiriman",detail:"Paket telah diterima oleh pihak kurir",date:"2026-10-16 08:20"}]},
 {id:"SF-1002",recipient:"Rizky Pratama",phone:"081298765432",address:"Jl. Raya Bogor KM 30, Jakarta Timur",courier:"J&T Express",service:"Express",weight:0.8,shippingCost:22000,status:"Menunggu pickup",trackingNumber:"",notes:"Hubungi sebelum datang",createdAt:"2026-10-16",history:[{status:"Menunggu pickup",detail:"Pengiriman dibuat oleh admin",date:"2026-10-16 11:05"}]},
 {id:"SF-1003",recipient:"Salsabila Aulia",phone:"082112223333",address:"Perumahan Citra Indah Blok C, Bogor",courier:"SiCepat",service:"Reguler",weight:1.5,shippingCost:20000,status:"Terkirim",trackingNumber:"SICEPAT908765",notes:"",createdAt:"2026-10-14",history:[{status:"Menunggu pickup",detail:"Pengiriman dibuat oleh admin",date:"2026-10-14 08:00"},{status:"Diproses",detail:"Paket disiapkan",date:"2026-10-14 09:00"},{status:"Dalam pengiriman",detail:"Paket menuju alamat penerima",date:"2026-10-14 15:30"},{status:"Terkirim",detail:"Paket diterima oleh penerima",date:"2026-10-15 13:12"}]},
 {id:"SF-1004",recipient:"Dimas Saputra",phone:"085677889900",address:"Jl. Kemang Selatan, Jakarta Selatan",courier:"AnterAja",service:"Ekonomi",weight:2,shippingCost:16000,status:"Diproses",trackingNumber:"ANTERAJA556677",notes:"",createdAt:"2026-10-16",history:[{status:"Menunggu pickup",detail:"Pengiriman dibuat oleh admin",date:"2026-10-16 09:40"},{status:"Diproses",detail:"Paket sedang dikemas",date:"2026-10-16 10:10"}]},
 {id:"SF-1005",recipient:"Maya Lestari",phone:"081355667788",address:"Jl. Sudirman No. 88, Tangerang",courier:"Pos Indonesia",service:"Reguler",weight:0.5,shippingCost:12000,status:"Gagal",trackingNumber:"POS99887766",notes:"Alamat tidak ditemukan",createdAt:"2026-10-13",history:[{status:"Menunggu pickup",detail:"Pengiriman dibuat oleh admin",date:"2026-10-13 08:00"},{status:"Dalam pengiriman",detail:"Paket dibawa kurir",date:"2026-10-13 14:00"},{status:"Gagal",detail:"Pengiriman gagal: alamat tidak ditemukan",date:"2026-10-14 16:10"}]}
];
let shipments = loadShipments();
let currentRole = "admin";
const $ = id => document.getElementById(id);
function loadShipments(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):seed.map(x=>({...x,history:[...x.history]}));}catch(e){return seed.map(x=>({...x,history:[...x.history]}));}}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(shipments));}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function statusClass(s){return "status-"+s.toLowerCase().replaceAll(" ","-");}
function statusPill(s){return `<span class="status ${statusClass(s)}">${escapeHtml(s)}</span>`;}
function dateText(d){if(!d)return "—";const [y,m,day]=d.split("-");return `${day}/${m}/${y}`;}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}
function getStatusCount(s){return shipments.filter(x=>x.status===s).length;}
function renderStats(){
 $("statTotal").textContent=shipments.length;$("statPending").textContent=getStatusCount("Menunggu pickup");$("statTransit").textContent=getStatusCount("Dalam pengiriman");$("statDelivered").textContent=getStatusCount("Terkirim");
 $("reportTotal").textContent=shipments.length;$("reportFailed").textContent=getStatusCount("Gagal");$("reportRate").textContent=(shipments.length?Math.round(getStatusCount("Terkirim")/shipments.length*100):0)+"%";
 const statuses=["Menunggu pickup","Diproses","Dalam pengiriman","Terkirim","Gagal"];
 $("reportBars").innerHTML=statuses.map((s,i)=>{let n=getStatusCount(s),pct=shipments.length?n/shipments.length*100:0;return `<div><div class="bar-label"><span>${s}</span><span>${n} paket</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${["#d99b2b","#4b79e8","#8b61d5","#24a16c","#dc6262"][i]}"></div></div></div>`}).join("");
}
function rowHtml(s,compact=false){
 const id=`<div class="id-main">${escapeHtml(s.id)}</div><div class="id-sub">${escapeHtml(s.trackingNumber||"Resi belum tersedia")}</div>`;
 const recipient=`<div class="recipient-name">${escapeHtml(s.recipient)}</div><div class="recipient-address" title="${escapeHtml(s.address)}">${escapeHtml(s.address)}</div>`;
 if(compact)return `<tr><td>${id}</td><td>${recipient}</td><td>${escapeHtml(s.courier)}</td><td>${statusPill(s.status)}</td><td><button class="small-btn" data-track="${escapeHtml(s.id)}">Lacak</button></td></tr>`;
 return `<tr><td>${id}</td><td>${recipient}<div class="id-sub">${escapeHtml(s.phone)}</div></td><td>${escapeHtml(s.courier)}<div class="id-sub">${escapeHtml(s.service)}</div></td><td>${dateText(s.createdAt)}</td><td>${statusPill(s.status)}</td><td><div class="row-actions"><button class="small-btn" data-track="${escapeHtml(s.id)}">Lacak</button>${currentRole==="admin"?`<button class="small-btn" data-edit="${escapeHtml(s.id)}">Edit</button><button class="small-btn danger" data-delete="${escapeHtml(s.id)}">Hapus</button>`:""}</div></td></tr>`;
}
function renderTables(){
 const recent=[...shipments].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,5);
 $("recentRows").innerHTML=recent.length?recent.map(s=>rowHtml(s,true)).join():`<tr><td colspan="5"><div class="empty">Belum ada pengiriman.</div></td></tr>`;
 const q=($("shipmentSearch").value||"").toLowerCase(),st=$("statusFilter").value;
 const filtered=shipments.filter(s=>(!q||[s.id,s.recipient,s.trackingNumber,s.address].some(v=>(v||"").toLowerCase().includes(q)))&&(!st||s.status===st)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 $("shipmentRows").innerHTML=filtered.length?filtered.map(s=>rowHtml(s)).join():`<tr><td colspan="6"><div class="empty"><b>Data tidak ditemukan</b>Coba kata kunci atau filter yang lain.</div></td></tr>`;
 $("shipmentCount").textContent=`Menampilkan ${filtered.length} dari ${shipments.length} pengiriman`;
 renderStats();
}
function goPage(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 const titles={dashboard:"Dashboard",shipments:"Data Pengiriman",tracking:"Tracking Paket",reports:"Laporan Pengiriman"};$("pageTitle").textContent=titles[page]||"Dashboard";
 if(page==="tracking"&&currentRole==="customer")$("trackingInput").focus();
}
function updateRole(){
 currentRole=$("roleSelect").value;
 document.querySelectorAll(".admin-only").forEach(el=>el.classList.toggle("hidden",currentRole!=="admin"));
 $("profileName").textContent=currentRole==="admin"?"Admin ShipFlow":"Customer";$("profileRole").textContent=currentRole==="admin"?"Administrator":"Pelacakan paket";
 if(currentRole==="customer"&&$("page-reports").classList.contains("active"))goPage("dashboard");
 renderTables();
}
function openModal(id=null){
 if(currentRole!=="admin")return;
 $("shipmentForm").reset();$("editId").value="";$("weight").value="1";$("shippingCost").value="15000";$("modalTitle").textContent=id?"Edit pengiriman":"Buat pengiriman";$("formError").textContent="";
 if(id){const s=shipments.find(x=>x.id===id);if(!s)return;$("editId").value=s.id;$("recipient").value=s.recipient;$("phone").value=s.phone;$("address").value=s.address;$("courier").value=s.courier;$("service").value=s.service;$("weight").value=s.weight;$("shippingCost").value=s.shippingCost;$("shipmentStatus").value=s.status;$("trackingNumber").value=s.trackingNumber;$("notes").value=s.notes||"";}
 $("shipmentModal").classList.add("open");$("shipmentModal").setAttribute("aria-hidden","false");
}
function closeModal(){$("shipmentModal").classList.remove("open");$("shipmentModal").setAttribute("aria-hidden","true");}
function stamp(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;}
function updateHistory(s,newStatus,detail){
 if(s.status!==newStatus){s.status=newStatus;s.history.push({status:newStatus,detail,date:stamp()});}
}
function renderTracking(idOrResi){
 const q=(idOrResi||"").trim().toLowerCase(),box=$("trackingResult");
 if(!q){box.innerHTML=`<div class="panel empty"><b>Masukkan nomor pengiriman</b>Gunakan ID seperti SF-1001 atau nomor resi kurir.</div>`;return;}
 const s=shipments.find(x=>x.id.toLowerCase()===q||(x.trackingNumber||"").toLowerCase()===q);
 if(!s){box.innerHTML=`<div class="panel empty"><b>Paket tidak ditemukan</b>Periksa kembali ID pengiriman atau nomor resi.</div>`;return;}
 const history=[...s.history].reverse();
 box.innerHTML=`<div class="track-card"><div class="track-card-head"><div><h3>${escapeHtml(s.id)} · ${escapeHtml(s.recipient)}</h3><p>${escapeHtml(s.courier)} ${escapeHtml(s.service)} · Resi: ${escapeHtml(s.trackingNumber||"Belum tersedia")}</p><p style="margin-top:8px">${escapeHtml(s.address)}</p></div>${statusPill(s.status)}</div><div class="timeline">${history.map((h,i)=>`<div class="timeline-item ${i===0?"":"pending"}"><div class="timeline-dot"></div><div><b>${escapeHtml(h.status)}</b><small>${escapeHtml(h.detail)} · ${escapeHtml(h.date)}</small></div></div>`).join("")}</div>${s.notes?`<div class="tip-box"><b>Catatan pengiriman</b><p>${escapeHtml(s.notes)}</p></div>`:""}</div>`;
}
function exportCsv(){
 const rows=[["ID","Penerima","Telepon","Alamat","Kurir","Layanan","Berat (kg)","Biaya Kirim","Status","Nomor Resi","Tanggal"],...shipments.map(s=>[s.id,s.recipient,s.phone,s.address,s.courier,s.service,s.weight,s.shippingCost,s.status,s.trackingNumber,s.createdAt])];
 const csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="laporan-pengiriman.csv";a.click();URL.revokeObjectURL(url);toast("Laporan CSV berhasil diekspor");
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>goPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>goPage(b.dataset.goto)));
$("roleSelect").addEventListener("change",updateRole);
["addShipment","addShipmentTop","quickAdd"].forEach(id=>$(id).addEventListener("click",()=>openModal()));
$("closeModal").addEventListener("click",closeModal);$("cancelModal").addEventListener("click",closeModal);
$("shipmentModal").addEventListener("click",e=>{if(e.target===$("shipmentModal"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("shipmentForm").addEventListener("submit",e=>{
 e.preventDefault();if(currentRole!=="admin")return;
 const editId=$("editId").value,old=shipments.find(s=>s.id===editId);
 const s=old||{id:"SF-"+(1001+Math.max(0,...shipments.map(x=>Number(x.id.replace("SF-",""))-1000))),history:[],createdAt:new Date().toISOString().slice(0,10)};
 Object.assign(s,{recipient:$("recipient").value.trim(),phone:$("phone").value.trim(),address:$("address").value.trim(),courier:$("courier").value,service:$("service").value,weight:Number($("weight").value),shippingCost:Number($("shippingCost").value),trackingNumber:$("trackingNumber").value.trim(),notes:$("notes").value.trim()});
 const newStatus=$("shipmentStatus").value;
 if(!old){s.status=newStatus;s.history.push({status:newStatus,detail:"Pengiriman dibuat oleh admin",date:stamp()});shipments.unshift(s);}
 else updateHistory(s,newStatus,"Status pengiriman diperbarui oleh admin");
 if(old&&old.status===newStatus)s.history.push({status:newStatus,detail:"Data pengiriman diperbarui oleh admin",date:stamp()});
 persist();renderTables();closeModal();toast(old?"Data pengiriman diperbarui":"Pengiriman baru berhasil dibuat");
});
$("shipmentSearch").addEventListener("input",renderTables);$("statusFilter").addEventListener("change",renderTables);
$("trackButton").addEventListener("click",()=>renderTracking($("trackingInput").value));
$("trackingInput").addEventListener("keydown",e=>{if(e.key==="Enter")renderTracking($("trackingInput").value);});
document.addEventListener("click",e=>{
 const track=e.target.closest("[data-track]");if(track){goPage("tracking");$("trackingInput").value=track.dataset.track;renderTracking(track.dataset.track);return;}
 const edit=e.target.closest("[data-edit]");if(edit){openModal(edit.dataset.edit);return;}
 const del=e.target.closest("[data-delete]");if(del){const s=shipments.find(x=>x.id===del.dataset.delete);if(s&&confirm(`Hapus pengiriman ${s.id} atas nama ${s.recipient}?`)){shipments=shipments.filter(x=>x.id!==s.id);persist();renderTables();toast("Data pengiriman dihapus");}}
});
$("exportCsv").addEventListener("click",exportCsv);
$("today").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"}).format(new Date());
renderTables();updateRole();
