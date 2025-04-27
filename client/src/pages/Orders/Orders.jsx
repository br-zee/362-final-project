import { useEffect, useState } from "react";
import "./Orders.css";
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

    console.log(orders)

    return (
        <div>
            Orders
        </div>
    )
}