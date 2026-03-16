import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard(){

const [orders,setOrders] = useState([]);
const [filter,setFilter] = useState("all");
const [search,setSearch] = useState("");

const loadOrders = () => {

const storedOrders =
JSON.parse(localStorage.getItem("orders")) || [];

const fixedOrders = storedOrders.map(order => ({
...order,
status: order.status || "Pending"
}));

setOrders(fixedOrders);

};

useEffect(()=>{
loadOrders();
},[]);

const markReady = (id) => {

const updated = orders.map(order =>
order.id === id
? {...order,status:"Ready"}
: order
);

setOrders(updated);
localStorage.setItem("orders",JSON.stringify(updated));

};

const startPreparing = (id) => {

const updated = orders.map(order =>
order.id === id
? {...order,status:"Pending"}
: order
);

setOrders(updated);
localStorage.setItem("orders",JSON.stringify(updated));

};

const filtered = orders
.filter(o=>{
if(filter==="pending") return o.status==="Pending";
if(filter==="preparing") return o.status==="Preparing";
if(filter==="ready") return o.status==="Ready";
return true;
})
.filter(o=>
o.id.toLowerCase().includes(search.toLowerCase())
);

return(

<div className="admin-page">

{/* HEADER */}

<div className="admin-header">

<div>
<h1>Live Orders</h1>
<p>Real-time order management dashboard</p>
</div>

<button className="refresh-btn" onClick={loadOrders}>
Refresh
</button>

</div>


{/* STATS */}

<div className="stats-grid">

<div className="stat-card">
<h4>Total Orders</h4>
<span>{orders.length}</span>
</div>

<div className="stat-card">
<h4>Pending</h4>
<span>{orders.filter(o=>o.status==="Pending").length}</span>
</div>

<div className="stat-card">
<h4>Preparing</h4>
<span>{orders.filter(o=>o.status==="Preparing").length}</span>
</div>

<div className="stat-card">
<h4>Ready</h4>
<span>{orders.filter(o=>o.status==="Ready").length}</span>
</div>

</div>


{/* FILTER */}

<div className="filter-row">

<div className="filters">

<button onClick={()=>setFilter("all")}>All</button>
<button onClick={()=>setFilter("pending")}>Pending</button>
<button onClick={()=>setFilter("preparing")}>Preparing</button>
<button onClick={()=>setFilter("ready")}>Ready</button>

</div>

<input
className="search"
placeholder="Search order ID..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{/* ORDERS */}

<div className="orders-grid">

{filtered.map(order=>(
<div key={order.id} className="order-card">

<div className="order-header">

<h3>{order.id}</h3>

<span className={`status ${(order.status || "").toLowerCase()}`}>
{order.status}
</span>

</div>

<div className="order-items">

{order.items.map(item=>(
<p key={item.id}>
{item.name} × {item.qty}
</p>
))}

</div>

<div className="order-footer">

<h4>₹{order.total}</h4>

<div className="actions">

{order.status==="Pending" &&
<button onClick={()=>startPreparing(order.id)}>
Start
</button>}

{order.status!=="Ready" &&
<button
className="ready-btn"
onClick={()=>markReady(order.id)}
>
Ready
</button>}

</div>

</div>

</div>
))}

</div>

</div>

);

}

export default AdminDashboard;