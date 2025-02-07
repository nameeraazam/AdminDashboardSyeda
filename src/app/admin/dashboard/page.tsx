"use client";

// import React, { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import ProtectedRoute from "../../components/protected/page";

// interface Order {
//   _id: string;
//   firstname: string;
//   lastname: string;
//   phone: number;
//   email:string;
//   address:string;
//   city: string;
//   country:string;
//   postalzipcode: number;
//   total: number;
//   discount: number;
//   orderDate: string;
//   status: string | null;
//   cartitems: { name: string; image: string }[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           firstname,
//           lastname,
//           phone,
//           email,
//           address,
//           city,
//           country,
//           postalzipcode,
//           total,
//           discount,
//           orderDate,
//           status,
//           cartitems[]->{
//             productName,
//             image
//           }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, []);

//   const filteredOrders =
//     filter === "All" ? orders : orders.filter((order) => order.status === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       Swal.fire("Deleted!", "Your order has been deleted.", "success");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       Swal.fire("Error!", "Something went wrong while deleting.", "error");
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client
//         .patch(orderId)
//         .set({ status: newStatus })
//         .commit();

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );

//       if (newStatus === "dispatch") {
//         Swal.fire("Dispatch", "The order is now dispatched.", "success");
//       } else if (newStatus === "success") {
//         Swal.fire("Success", "The order has been completed.", "success");
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       Swal.fire("Error!", "Something went wrong while updating the status.", "error");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-screen bg-gray-100">
//         {/* Navbar */}
//         <nav className="bg-black text-white p-4 shadow-lg flex justify-between">
//           <h2 className="text-4xl font-bold text-[#ff9f0d]">Admin Dashboard</h2>
//           <div className="flex space-x-4  ">
//             {["All", "pending", "dispatch", "success"].map((status) => (
//               <button
//                 key={status}
//                 className={`px-4 py-2 rounded-lg transition-all ${
//                   filter === status ? "bg-[#ff9f0d] text-[#333333] font-bold" : "text-white"
//                 }`}
//                 onClick={() => setFilter(status)}
//               >
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </button>
//             ))}
//           </div>
//         </nav>

//         {/* Orders Grid */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <h2 className="text-4xl font-bold mb-4 text-center text-[#ff9f0d] border border-b-black">ORDER REQUESTS</h2>
//           <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredOrders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white border border-[#ff9f0d] shadow-md rounded-lg p-4 hover:bg-[#ff9f0d] transition-all cursor-pointer"
//                 onClick={() => toggleOrderDetails(order._id)}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold text-2xl text-[#ff9f0d]">{order.firstname} {order.lastname}</h3>
//                   <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
//                 </div>

//                 <div className="space-y-2">
//                   <p><strong>Phone:</strong> {order.phone}</p>
//                   <p><strong>Email:</strong> {order.email}</p>
//                   <p><strong>Address:</strong> {order.address}</p>
//                   <p><strong>Total:</strong> ${order.total}</p>
//                   <p><strong>Status:</strong> {order.status || "Pending"}</p>
//                 </div>

//                 <div className="mt-4">
//                   <select
//                     value={order.status || ""}
//                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                     className="w-full bg-gray-100 p-2 rounded"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="dispatch">Dispatch</option>
//                     <option value="success">Completed</option>
//                   </select>
//                 </div>

//                 <div className="mt-4 text-center">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(order._id);
//                     }}
//                     className="bg-[#ff9f0d] text-white px-4 py-2 rounded hover:bg-[#cc7a09] transition"
//                   >
//                     Delete
//                   </button>
//                 </div>

//                 {/* Order Details */}
//                 {selectedOrderId === order._id && (
//                   <div className="mt-4 bg-[#f6f6f6] p-4 rounded">
//                     <h4 className="font-semibold">Order Details</h4>
//                     <p><strong>Phone:</strong> {order.phone}</p>
//                     <p><strong>Email:</strong> {order.email}</p>
//                     <p><strong>City:</strong> {order.city}</p>
//                     <ul className="space-y-2">
//                       {order.cartitems.map((item, index) => (
//                         <li key={${order._id}-${index}} className="flex items-center gap-2">
//                           {item.name}
//                           {item.image && (
//                             <Image src={urlFor(item.image).url()} width={40} height={40} alt={item.name} />
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }