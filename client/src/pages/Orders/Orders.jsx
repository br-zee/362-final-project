import { useEffect, useState } from "react";
import "./Orders.scss";
import { makeRequest } from "../../makeRequest";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("data"));
        try {
            makeRequest.get(`/orders`)
            .then(res => setOrders(res.data.data))
            .catch(err => console.log(err));
        }
        catch(err) { console.log(err); }
    }, []);

    let totalPrices = [];
    orders.forEach((order, index) => {
        order.products.forEach(product => {
            const totalPrice = product.price * product.quantity;
            totalPrices[index] ? totalPrices[index] += totalPrice : totalPrices[index] = totalPrice;
        })
    })


    return (
        <>
            {orders && orders.map((order, index) => {

                const dateObj = new Date(order.createdAt)
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth();
                const date = dateObj.getDate();
                const time = dateObj.getTime();
                
                return (
                    <div key={`order-${order.id}`} className="order-box">
                        <h1>Order id: {order.id}</h1>
                        <p>Ordered on: {`${month}/${date}, ${year} at ${time} UTS`}</p>

                        {order.products.map(product =>
                            <div key={`order-${order.id}-product-${product.id}`} className="order-product">
                                <div className="order-details">
                                    <h1>{product.title}</h1>
                                    <p>{product.desc}</p>
                                    <img src={product.img} alt="" />
                                </div>
                                <p className="order-quantity">{product.quantity} x ${product.price}</p>
                            </div>
                        )}
                        <p>Total: ${totalPrices[index]}</p>
                    </div>
                )
            
            })}
        </>
    )
}