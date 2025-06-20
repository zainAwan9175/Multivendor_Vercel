import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.product);


 
const dispatch=useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
   window.location.reload();
  };
  // const products = [
  //   {
  //     id: 1,
  //     category: "Computers and Laptops",
  //     name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //     ],
  //     shop: {
  //       name: "Apple inc.",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 1099,
  //     discount_price: 1049,
  //     rating: 4,
  //     total_sell: 35,
  //     stock: 10,
  //     Finish_Date:"2025-05-24T14:30:00Z"
  //   },
  //   {
  //     id: 2,
  //     category: "Mobile and Tablets",
  //     name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Amazon Ltd",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     discount_price: 1099,
  //     rating: 5,
  //     total_sell: 80,
  //     stock: 10,
  //     category: "Mobile & Tablets",
  //   },
  //   {
  //     id:1,
  //     category: "Computers and Laptop",
  //     name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //     ],
  //     shop: {
  //       name: "Apple inc.",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 1099,
  //     discount_price: 1049,
  //     rating: 4,
  //     total_sell: 75,
  //     stock: 10,
  //     category: "Computers & Laptop",
  //   },
  //   {
  //     id: 4,
  //     category: "Others",
  //     name: "New Fashionable Watch for men 2023 with multiple colors",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //     ],
  //     shop: {
  //       name: "Shahriar Watch House",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //       category: "Others",
  //     },
  //     price: 100,
  //     discount_price: 79,
  //     rating: 4,
  //     total_sell: 12,
  //     stock: 10,
  //   },
  //   {
  //     id: 5,
  //     category: "Shoes",
  //     name: "New Trend shoes for gents with all sizes",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Alisha Shoes Mart",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 120,
  //     discount_price: 89,
  //     rating: 5,
  //     total_sell: 49,
  //     stock: 10,
  //     category: "Shoes",
  //   },
  //   {
  //     id: 1,
  //     name: "Gaming Headphone Asus with mutiple color and free delivery",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Asus Ltd",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 300,
  //     discount_price: 239,
  //     rating: 4.5,
  //     reviews: [
  //       {
  //         user: {
  //           // user object will be here
  //         },
  //         comment: "IT's so cool!",
  //         rating: 5,
  //       },
  //     ],
  //     total_sell: 20,
  //     stock: 10,
  //     category: "Music and Gaming",
  //   },
  //   {
  //     id: 4,
  //     name: "New Fashionable Watch for men 2023 with multiple colors",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
  //       },
  //     ],
  //     shop: {
  //       name: "Shahriar Watch House",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 100,
  //     discount_price: 79,
  //     rating: 4,
  //     total_sell: 62,
  //     stock: 10,
  //   },
  //   {
  //     id: 1,
  //     name: "Gaming Headphone Asus with mutiple color and free delivery",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Asus Ltd",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 300,
  //     discount_price: 239,
  //     rating: 4.5,
  //     reviews: [
  //       {
  //         user: {
  //           // user object will be here
  //         },
  //         comment: "IT's so cool!",
  //         rating: 5,
  //       },
  //     ],
  //     total_sell: 20,
  //     stock: 10,
  //   },
  //   {
  //     id: 2,
  //     category: "Mobile and Tablets",
  //     name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Amazon Ltd",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     discount_price: 1099,
  //     rating: 5,
  //     total_sell: 20,
  //     stock: 10,
  //   },
  //   {
  //     id: 1,
  //     category: "Music and Gaming",
  //     name: "Gaming Headphone Asus with mutiple color and free delivery",
  //     description:
  //       "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
  //     image_Url: [
  //       {
  //         public_id: "test",
  //         url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
  //       },
  //       {
  //         public_id: "test",
  //         url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
  //       },
  //     ],
  //     shop: {
  //       name: "Asus Ltd",
  //       shop_avatar: {
  //         public_id: "test",
  //         url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
  //       },
  //       ratings: 4.2,
  //     },
  //     price: 300,
  //     discount_price: 239,
  //     rating: 4.5,
  //     reviews: [
  //       {
  //         user: {
  //           // user object will be here
  //         },
  //         comment: "IT's so cool!",
  //         rating: 5,
  //       },
  //     ],
  //     total_sell: 20,
  //     stock: 10,
  //   },
  // ];
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      {false ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;