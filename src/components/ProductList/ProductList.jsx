import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";


import pizzaImg from "../../images/pizza.png";
import burgerImg from "../../images/burger.png";
import cocaImg from "../../images/coca.png";
import saladImg from "../../images/salad.png";
import waterImg from "../../images/water.png";
import iceCreamImg from "../../images/icecream.png";
import kebabImg from "../../images/kebab.png";


const products = [
    {id: '1', img: pizzaImg, title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые'},
    {id: '2', img: burgerImg, title: 'Куртка', price: 12000, description: 'Зеленого цвета, теплая'},
    {id: '3', img: cocaImg, title: 'Джинсы 2', price: 5000, description: 'Синего цвета, прямые'},
    {id: '4', img: saladImg, title: 'Куртка 8', price: 122, description: 'Зеленого цвета, теплая'},
    {id: '5', img: waterImg, title: 'Джинсы 3', price: 5000, description: 'Синего цвета, прямые'},
    {id: '6', img: iceCreamImg, title: 'Куртка 7', price: 600, description: 'Зеленого цвета, теплая'},
    {id: '7', img: kebabImg, title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые'},
    {id: '8', img: pizzaImg, title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая'},
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