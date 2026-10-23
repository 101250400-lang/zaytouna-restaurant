// Zaytouna demo menu. Change these sample prices, images and the WhatsApp number before publishing.
const WHATSAPP_NUMBER = "96170123456"; // Replace with the restaurant's WhatsApp number, country code included, digits only.
const money = value => `$${value.toFixed(2)}`;
const dishes = [
 {id:1,name:"وجبة المشاوي المشكلة",category:"مشاوي",description:"كباب، شيش طاووق، لحم مشوي وخضار",price:19.99,oldPrice:24.99,discount:20,image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",offer:true},
 {id:2,name:"وجبة كرسبي تشيكن",category:"كرسبي",description:"قطع دجاج مقرمشة مع بطاطا وصوص",price:10.99,oldPrice:12.99,discount:15,image:"https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",offer:true},
 {id:3,name:"وجبة دبل برغر",category:"برغر",description:"برغر لحم، جبنة، خس وصوص زيتونة",price:11.99,oldPrice:15.99,discount:25,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",offer:true},
 {id:4,name:"صحن المشاوي العائلي",category:"مشاوي",description:"تشكيلة مشاوي تكفي اللمّة",price:39.99,oldPrice:49.99,discount:20,image:"https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",offer:true},
 {id:5,name:"كباب مشوي",category:"مشاوي",description:"كباب متبّل ومشوي على الفحم",price:12.99,image:"https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80"},
 {id:6,name:"برغر لحم",category:"برغر",description:"لحم مشوي مع الجبنة والخضار الطازجة",price:8.99,image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"},
 {id:7,name:"كرسبي تشيكن",category:"كرسبي",description:"دجاج مقرمش مع صلصة خاصة",price:7.99,image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"},
 {id:8,name:"حمص مميّز",category:"مقبلات",description:"حمص كريمي بزيت الزيتون",price:4.99,image:"https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=80"},
 {id:9,name:"شاورما دجاج",category:"سندويشات",description:"دجاج متبّل، ثوم ومخلل بخبز طازج",price:5.99,image:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80"},
 {id:10,name:"شيش طاووق",category:"مشاوي",description:"قطع دجاج طرية بتتبيلة لبنانية",price:10.99,image:"https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80"},
 {id:11,name:"زنجر ساندويش",category:"سندويشات",description:"دجاج حار ومقرمش مع خس وصوص",price:6.99,image:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80"},
 {id:12,name:"فتوش لبناني",category:"مقبلات",description:"خضار طازجة، خبز محمّص ودبس رمان",price:4.50,image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"}
];
let activeCategory = "الكل";
let cart = JSON.parse(localStorage.getItem("zaytouna-cart") || "{}");
let favorites = JSON.parse(localStorage.getItem("zaytouna-favorites") || "[]");
let toastTimer;

const menuGrid = document.getElementById("menuGrid");
const offersGrid = document.getElementById("offersGrid");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const toast = document.getElementById("toast");

function dishImage(dish, className="") {
 return `<img class="${className}" src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'">`;
}
function renderOffers() {
 offersGrid.innerHTML = dishes.filter(d => d.offer).map(d => `
  <article class="offer-card">
   <div class="offer-image">${dishImage(d)}<span class="discount-badge">${d.discount}% OFF</span></div>
   <div class="offer-body"><h3>${d.name}</h3><p>${d.description}</p>
    <div class="price-row"><span class="price">${money(d.price)}</span><span class="old-price">${money(d.oldPrice)}</span></div>
    <button class="add-btn" data-add="${d.id}">أضف إلى السلة +</button>
   </div>
  </article>`).join("");
}
function renderMenu() {
 const query = searchInput.value.trim().toLocaleLowerCase("ar");
 const filtered = dishes.filter(d => (activeCategory === "الكل" || d.category === activeCategory) && `${d.name} ${d.description} ${d.category}`.toLocaleLowerCase("ar").includes(query));
 menuGrid.innerHTML = filtered.map(d => `
  <article class="food-card">
   <div class="food-image">${dishImage(d)}<button class="favorite-btn ${favorites.includes(d.id)?"favorited":""}" data-favorite="${d.id}" aria-label="أضف إلى المفضلة">${favorites.includes(d.id)?"♥":"♡"}</button>${d.discount?`<span class="discount-badge">${d.discount}% OFF</span>`:""}</div>
   <div class="food-info"><h3>${d.name}</h3><p>${d.description}</p>
    <div class="food-bottom"><span class="price">${money(d.price)}</span><button class="add-small" data-add="${d.id}">أضف إلى السلة +</button></div>
   </div>
  </article>`).join("");
 document.getElementById("resultsCount").textContent = `${filtered.length} وجبة`;
 document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
}
function saveCart(){localStorage.setItem("zaytouna-cart",JSON.stringify(cart));renderCartCount();renderCart();}
function renderCartCount(){document.getElementById("cartCount").textContent=Object.values(cart).reduce((sum,item)=>sum+item.qty,0);}
function cartEntries(){return Object.entries(cart).map(([id,item])=>({dish:dishes.find(d=>d.id===Number(id)),...item})).filter(x=>x.dish);}
function renderCart(){
 const entries=cartEntries();
 document.getElementById("cartEmpty").classList.toggle("hidden",entries.length>0);
 document.getElementById("cartFooter").classList.toggle("hidden",entries.length===0);
 document.getElementById("cartItems").innerHTML=entries.map(({dish,qty})=>`
  <div class="cart-item"><div><h3>${dish.name}</h3><small>${money(dish.price)} للوجبة</small><div class="qty-control"><button data-qty="${dish.id}" data-change="-1" aria-label="تقليل الكمية">−</button><strong>${qty}</strong><button data-qty="${dish.id}" data-change="1" aria-label="زيادة الكمية">+</button><button data-remove="${dish.id}" aria-label="حذف الوجبة" title="حذف">×</button></div></div><span class="cart-item-price">${money(dish.price*qty)}</span></div>`).join("");
 const total=entries.reduce((sum,item)=>sum+item.dish.price*item.qty,0);
 document.getElementById("cartSubtotal").textContent=money(total);
}
function openCart(){cartDrawer.classList.add("open");cartBackdrop.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){cartDrawer.classList.remove("open");cartBackdrop.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");document.body.style.overflow="";}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);}
function addToCart(id){const dish=dishes.find(d=>d.id===Number(id));if(!dish)return;cart[id]??={qty:0};cart[id].qty++;saveCart();showToast(`انضافت ${dish.name} إلى السلة ✓`);}
function setCategory(category){activeCategory=category;document.querySelectorAll(".category-tab").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));renderMenu();}

document.addEventListener("click",event=>{
 const add=event.target.closest("[data-add]");if(add){addToCart(add.dataset.add);return;}
 const fav=event.target.closest("[data-favorite]");if(fav){const id=Number(fav.dataset.favorite);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("zaytouna-favorites",JSON.stringify(favorites));renderMenu();showToast(favorites.includes(id)?"انضافت للمفضلة ♥":"انحذفت من المفضلة");return;}
 const qty=event.target.closest("[data-qty]");if(qty){const id=qty.dataset.qty;cart[id].qty+=Number(qty.dataset.change);if(cart[id].qty<=0)delete cart[id];saveCart();return;}
 const remove=event.target.closest("[data-remove]");if(remove){delete cart[remove.dataset.remove];saveCart();showToast("انحذفت الوجبة من السلة");}
});
document.getElementById("categoryTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(btn)setCategory(btn.dataset.category);});
searchInput.addEventListener("input",renderMenu);
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
cartBackdrop.addEventListener("click",closeCart);
document.getElementById("browseMenu").addEventListener("click",()=>{closeCart();document.getElementById("menu").scrollIntoView({behavior:"smooth"});});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("mainNav");const open=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("mainNav").classList.remove("open");document.getElementById("menuToggle").setAttribute("aria-expanded","false");}));
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();const entries=cartEntries();if(!entries.length)return;
 const form=new FormData(e.currentTarget);const name=String(form.get("customerName")).trim();const address=String(form.get("address")).trim();const notes=String(form.get("notes")||"").trim();
 const total=entries.reduce((sum,item)=>sum+item.dish.price*item.qty,0);
 const lines=entries.map(({dish,qty})=>`• ${dish.name} × ${qty} = ${money(dish.price*qty)}`);
 const message=`مرحباً زيتونة! بدي أكّد هالطلب:\n\n${lines.join("\n")}\n\nالمجموع: ${money(total)}\nالاسم: ${name}\nعنوان التوصيل: ${address}${notes?`\nملاحظات: ${notes}`:""}\n\nيرجى تأكيد الطلب ووقت التوصيل.`;
 if(!WHATSAPP_NUMBER || WHATSAPP_NUMBER==="96170123456"){showToast("عدّل رقم واتساب في script.js قبل استقبال الطلبات.");return;}
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("contactWhatsApp").addEventListener("click",e=>{if(WHATSAPP_NUMBER==="96170123456"){e.preventDefault();showToast("عدّل رقم واتساب في script.js قبل النشر.");}});
document.getElementById("year").textContent=new Date().getFullYear();
renderOffers();renderMenu();renderCartCount();renderCart();
