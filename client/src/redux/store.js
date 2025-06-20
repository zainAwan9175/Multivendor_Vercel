import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/users";
import { sellerReducer } from "./reducers/seller";
import { eventReducer } from "./reducers/event";
import { productReducer } from "./reducers/product";
import { wishlistReducer } from "./reducers/wishlist";
import { cartReducer } from "./reducers/cart";
import { orderReducer } from "./reducers/order";


const Store=configureStore({
    reducer:{
        user:userReducer,
        seller:sellerReducer,
        product:productReducer,
        event:eventReducer,
        cart:cartReducer,
        wishlist:wishlistReducer,
        order:orderReducer

    }
})

export default Store;