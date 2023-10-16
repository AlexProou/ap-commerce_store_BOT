import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";


// import pizzaImg from "../../images/pizza.png";
import burgerImg from "../../images/burger.png";
import cocaImg from "../../images/coca.png";
import saladImg from "../../images/salad.png";
import waterImg from "../../images/water.png";
import iceCreamImg from "../../images/icecream.png";
import kebabImg from "../../images/kebab.png";

import comix_1_Img from "../../images/comix_1.jpg";
import comix_2_Img from "../../images/comix_2.jpg";
import comix_3_Img from "../../images/comix_3.jpg";
import comix_4_Img from "../../images/comix_4.jpg";
import comix_5_Img from "../../images/comix_5.jpg";
import comix_6_Img from "../../images/comix_6.jpg";
import comix_7_Img from "../../images/comix_7.jpg";
import comix_8_Img from "../../images/comix_8.jpg";



// const products = [
//     {id: '1', img: comix_1_Img, title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые'},
//     {id: '2', img: burgerImg, title: 'Куртка', price: 12000, description: 'Зеленого цвета, теплая'},
//     {id: '3', img: cocaImg, title: 'Джинсы 2', price: 5000, description: 'Синего цвета, прямые'},
//     {id: '4', img: saladImg, title: 'Куртка 8', price: 122, description: 'Зеленого цвета, теплая'},
//     {id: '5', img: waterImg, title: 'Джинсы 3', price: 5000, description: 'Синего цвета, прямые'},
//     {id: '6', img: iceCreamImg, title: 'Куртка 7', price: 600, description: 'Зеленого цвета, теплая'},
//     {id: '7', img: kebabImg, title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые'},
//     // {id: '8', img: pizzaImg, title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая'},
// ]

const products = [
    {id: '1', img: comix_1_Img, title: 'Injustice: Gods Among Us:', description: ' Year One ', price: 1500},
    {id: '2', img: comix_2_Img, title: 'Injustice: Gods Among Us:', description: 'Year Two ', price: 1300},
    {id: '3', img: comix_3_Img, title: 'Injustice: Gods Among Us:', description: 'Year Three', price: 930},
    {id: '4', img: comix_4_Img, title: 'Injustice: Gods Among Us:', description: 'Year Four ', price: 1080},
    {id: '5', img: comix_5_Img, title: 'Injustice: Gods Among Us:', description: ' Year Five', price: 1750},
    {id: '6', img: comix_6_Img, title: 'Куртка 7', price: 600, description: 'Зеленого цвета, теплая'},
    {id: '7', img: comix_7_Img, title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые'},
    {id: '8', img: comix_8_Img, title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])



    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;