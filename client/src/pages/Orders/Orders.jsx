import { useEffect, useState } from "react";
import "./Orders.scss";
import { makeRequest } from "../../makeRequest";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("data"));
        if (userData) {
            setUser(userData?.id);
        }
    }, []);

    useEffect(() => {
        try {
            makeRequest.get(`/orders?filters[user][$eq]=${user}`)
            .then(res => setOrders(res.data.data))
            .catch(err => console.log(err));
        }
        catch(err) { console.log(err); }
    }, [user])

    let totalPrices = [];
    orders.forEach((order, index) => {
        order.products.forEach(product => {
            const totalPrice = product.price * product.quantity;
            totalPrices[index] ? totalPrices[index] += totalPrice : totalPrices[index] = totalPrice;
        })
    })

    function cancelOrder(e) {
        e.preventDefault();

        const docId = e.target.id;
        makeRequest.delete(`/orders/${docId}`)
        .then(() => location.reload());
    }  


    return (
        <>
            {user
                ? orders.length > 0
                    ? orders.map((order, index) => {

                        const dateObj = new Date(order.createdAt)
                        const year = dateObj.getFullYear();
                        const month = dateObj.getMonth();
                        const date = dateObj.getDate();
                        const time = dateObj.getTime();
                        
                        return (
                            <form key={`order-${order.id}`} className="order-box" id={order.documentId} onSubmit={cancelOrder}>
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
                                <button type="submit">Cancel Order</button>
                            </form>
                        )
                })
                : <p style={{
                    textAlign: 'center',
                    marginBlock: '40px'
                }}>
                    No orders found
                </p>

            : <p style={{
                textAlign: 'center',
                marginBlock: '40px'
            }}>
                No user found
            </p>
            }
        </>
    )
}