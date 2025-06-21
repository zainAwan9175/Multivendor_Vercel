import axios from "axios";

// create the product

export const createProduct=(newForm)=>async(dispatch)=>{
    try{
        dispatch({
            type:"productCreateRequest",
        })
        const config={headers:{"Content-Type":"multipart/form-data"}}
        const {data}=await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/product/create-product`,
            newForm,
            config
        )
 
        dispatch({
            type:"productCreateSuccess",
            payload:data.product
        })
    }
    catch(err)
    {
        dispatch({
            type:"productCreateFail",
            payload:err.response.data.message
        })

    }
}


// get all product of shop

export const getAllProductsShop=(id)=>async(dispatch)=>{
    try{
        dispatch({
            type:"getAllProductShopRequest",
        })
        
        const {data}=await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/product/get-all-products-shop/${id}`,
          
        )

        dispatch({
            type:"getAllProductShopSuccess",
            payload:data.products
        })
    }
    catch(err)
    {
        dispatch({
            type:"getAllProductShopFailed",
            payload:err.response.data.message
        })

    }
}

//delete product of Shop 

export const deleteProduct=(id)=>async(dispatch)=>{
    try{
        dispatch({
            type:"deleteProductRequest",
        })
        
        const {data}=await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/product/delete-shop-product/${id}`,{ withCredentials: true }
          
        )

        dispatch({
            type:"deleteProductSuccess",
            payload:data.message
        })
    }
    catch(err)
    {
        dispatch({
            type:"deleteProductFailed",
            payload:err.response.data.message
        })

    }
}

// get all products
export const getAllProducts = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllProductsRequest",
      });
  
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/get-all-products`);
      console.log(data.products)
      dispatch({
        type: "getAllProductsSuccess",
        payload: data.products,
      });
    } catch (error) {
      dispatch({
        type: "getAllProductsFailed",
        payload: error.response.data.message,
      });
    }
  };