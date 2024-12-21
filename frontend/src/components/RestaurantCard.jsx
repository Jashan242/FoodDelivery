import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import veg from "../assets/veg.svg"
import nonVeg from "../assets/nonveg.svg"

const RestaurantCard = () => {
    const [foodItems,setFoodItems] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData= async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fooddelivery-d0xd.onrender.com/food/restaurant/${id}`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        setFoodItems(data);
        console.log(foodItems);
    }

    const addToCart = async (foodItemId) => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate("/login");
        }
        const response = await fetch(`https://fooddelivery-d0xd.onrender.com/cart`,{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({foodItem:foodItemId,quantity:1})
        });
        const data = await response.json();
        console.log(data);
    }
    return (
        <div>
            <Navbar/>
            {/* <h1>Restaurant Card</h1> */}
            <div className="flex flex-col justify-center items-center gap-4 flex-wrap p-6 py-10">
            {foodItems.foodItems?.length > 0 ? (
                foodItems.foodItems.map((item) => (
                    <div key={item._id} className="bg-white flex flex-col md:flex-row shadow-md md:w-1/2 rounded-lg gap-4 items-center p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-[45%]">
                    <div className="">
                        <img src={item.imageUrl} alt={item.name} className="w-56 h-40 rounded-md object-cover"/>
                    </div>
                        <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <h1 className="text-2xl font-bold py-1">{item.name}</h1>
                            <img src={item.isVeg ? veg : nonVeg} alt={item.isVeg ? "Veg" : "Non-Veg"} className="w-6 h-6"/>
                        </div>
                            <p className="text-md font-semibold">{item.description}</p>
                            <p className="text-md font-semibold text-[#b8165c]">₹{item.price}</p>
                            <p className="text-md text-gray-500 font-semibold">⭐ {item.ratings}</p>
                            <button className="bg-[#b8165c] w-24 text-white border-2 border-[#b8165c] px-4 py-2 rounded-md font-semibold hover:border-[#b8165c] hover:text-[#b8165c] hover:bg-white" onClick={()=>addToCart(item._id)}>Add</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading food items...</p>
            )}
        </div>
        </div>
    )
}

export default RestaurantCard;