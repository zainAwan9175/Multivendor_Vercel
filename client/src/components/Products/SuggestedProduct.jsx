"use client"

import { useState } from "react"
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
// import { server } from "../../server";
import styles from "../../styles/styles"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { MdTrackChanges } from "react-icons/md"
import { RxCross1 } from "react-icons/rx"

import { loadUser } from "../../redux/actions/user"
import { Country, State } from "country-state-city"
import { useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
// import { getAllOrdersOfUser } from "../../redux/actions/orderAction";

const ProfileContent = ({ active }) => {
  const { user, error } = useSelector((state) => state.user)
  const [name, setName] = useState(user && user.name)
  const [email, setEmail] = useState(user && user.email)
  const [address1, setaddress1] = useState(user && user.addresses.address1)
  const [address2, setaddress2] = useState(user && user.addresses.address2)
  const [zipCode, setzipCode] = useState(user && user.addresses.zipCode)
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber)
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const dispatch = useDispatch()

  //   useEffect(() => {
  //     if (error) {
  //       toast.error(error);
  //       dispatch({ type: "clearErrors" });
  //     }
  //     if (successMessage) {
  //       toast.success(successMessage);
  //       dispatch({ type: "clearMessages" });
  //     }
  //   }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault()
    // dispatch(updateUserInformation(name, email, phoneNumber, password));
  }

  const handleImage = async (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result)
        axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            },
          )
          .then((response) => {
            dispatch(loadUser())
            toast.success("avatar updated successfully!")
          })
          .catch((error) => {
            toast.error(error)
          })
      }
    }

    reader.readAsDataURL(e.target.files[0])
  }

  return (
    <div className="w-full md:pl-4">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132] shadow-lg"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] hover:bg-gray-200 transition-all">
                <input type="file" id="image" className="hidden" onChange={handleImage} />
                <label htmlFor="image" className="cursor-pointer">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true} className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Address 2</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={address1}
                    onChange={(e) => setaddress1(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Address 1</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={address2}
                    onChange={(e) => setaddress2(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 font-medium text-gray-700">Zip Code</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3ad132] focus:outline-none rounded-md p-2`}
                    required
                    value={password}
                    onChange={(e) => setzipCode(e.target.value)}
                  />
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-all font-medium`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Orders</h2>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Refunds</h2>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Track Orders</h2>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ChangePassword />
        </div>
      )}

      {/*  user Payments */}
      {active === 7 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Payment />
        </div>
      )}
      {/*  user Address */}
      {active === 8 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Address />
        </div>
      )}
    </div>
  )
}

const AllOrders = () => {
  const { user } = useSelector((state) => state.user)
  //   const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch()
  const orders = [
    {
      _id: "7463wbfbhfbrtr28820221",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 120,
      orderStatus: "Processing",
    },
    {
      _id: "8463gcfgjdfkjg33443322",
      orderItems: [{ name: "Samsung Galaxy S23 Ultra" }],
      totalPrice: 140,
      orderStatus: "Shipped",
    },
    {
      _id: "9463hfhjdfjdf99384412",
      orderItems: [{ name: "MacBook Pro 16-inch" }],
      totalPrice: 2500,
      orderItems: [{ name: "Sony WH-1000XM5 Headphones" }],
      totalPrice: 350,
      orderStatus: "Processing",
    },
    {
      _id: "11463sdfsdffjfj9848334",
      orderItems: [{ name: "Apple Watch Series 9" }],
      totalPrice: 400,
      orderStatus: "Cancelled",
    },
  ]

  useEffect(() => {
    // dispatch(getAllOrdersOfUser(user._id));
  }, [])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => (params.value === "Delivered" ? "greenColor" : "redColor"),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "More ",
      flex: 1,
      minWidth: 150,
      headerName: "More",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        )
      },
    },
  ]

  const row = []

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      })
    })

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="bg-white rounded-md overflow-hidden"
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f9fafb",
            borderBottom: "2px solid #e5e7eb",
          },
          "& .greenColor": {
            color: "#10b981",
            fontWeight: "600",
          },
          "& .redColor": {
            color: "#ef4444",
            fontWeight: "600",
          },
        }}
      />
    </div>
  )
}

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user)
  // const { orders } = useSelector((state) => state.order);
  const orders = [
    {
      _id: "7463wbfbhfbrtr28820221",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 120,
      orderStatus: "Processing refund",
    },
    {
      _id: "8463gcfgjdfkjg33443322",
      orderItems: [{ name: "Samsung Galaxy S23 Ultra" }],
      totalPrice: 140,
      orderStatus: "Shipped",
    },
    {
      _id: "9463hfhjdfjdf99384412",
      orderItems: [{ name: "MacBook Pro 16-inch" }],
      totalPrice: 2500,
      orderStatus: "Delivered",
    },
    {
      _id: "10463dfdfkdkdk9484833",
      orderItems: [{ name: "Sony WH-1000XM5 Headphones" }],
      totalPrice: 350,
      orderStatus: "Processing",
    },
    {
      _id: "11463sdfsdffjfj9848334",
      orderItems: [{ name: "Apple Watch Series 9" }],
      totalPrice: 400,
      orderStatus: "Cancelled",
    },
  ]
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(getAllOrdersOfUser(user._id));
  }, [])

  const eligibleOrders = orders && orders.filter((item) => item.orderStatus === "Processing refund")

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => (params.value === "Delivered" ? "greenColor" : "redColor"),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        )
      },
    },
  ]

  const row = []

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      })
    })

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        className="bg-white rounded-md overflow-hidden"
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f9fafb",
            borderBottom: "2px solid #e5e7eb",
          },
          "& .greenColor": {
            color: "#10b981",
            fontWeight: "600",
          },
          "& .redColor": {
            color: "#ef4444",
            fontWeight: "600",
          },
        }}
      />
    </div>
  )
}

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user)
  // const { orders } = useSelector((state) => state.order);
  const orders = [
    {
      _id: "7463wbfbhfbrtr28820221",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 120,
      orderStatus: "Processing",
    },
    {
      _id: "8463gcfgjdfkjg33443322",
      orderItems: [{ name: "Samsung Galaxy S23 Ultra" }],
      totalPrice: 140,
      orderStatus: "Shipped",
    },
    {
      _id: "9463hfhjdfjdf99384412",
      orderItems: [{ name: "MacBook Pro 16-inch" }],
      totalPrice: 2500,
      orderItems: [{ name: "Sony WH-1000XM5 Headphones" }],
      totalPrice: 350,
      orderStatus: "Processing",
    },
    {
      _id: "11463sdfsdffjfj9848334",
      orderItems: [{ name: "Apple Watch Series 9" }],
      totalPrice: 400,
      orderStatus: "Cancelled",
    },
  ]

  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(getAllOrdersOfUser(user._id));
  }, [])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => (params.value === "Delivered" ? "greenColor" : "redColor"),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        )
      },
    },
  ]

  const row = []

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,

        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      })
    })

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="bg-white rounded-md overflow-hidden"
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f9fafb",
            borderBottom: "2px solid #e5e7eb",
          },
          "& .greenColor": {
            color: "#10b981",
            fontWeight: "600",
          },
          "& .redColor": {
            color: "#ef4444",
            fontWeight: "600",
          },
        }}
      />
    </div>
  )
}

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const passwordChangeHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )

      // If success
      toast.success(res.data.message || "Password updated successfully!")
    } catch (error) {
      // If error
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
    }
  }
  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">Change Password</h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2 font-medium text-gray-700">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2 font-medium text-gray-700">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2 font-medium text-gray-700">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-all font-medium`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
const Payment = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[000000ba] pb-2">Payment Methods</h1>
        <div className={`${styles.button} !rounded-md hover:opacity-90 transition-all`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>

      <br />

      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow-md justify-between pr-10 hover:bg-gray-50 transition-all">
        <div className="flex items-center">
          <img src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg" alt="" className="h-8" />
          <h5 className="pl-5 font-[600]">Shahriar Sajeeb</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>1234 **** **** ****</h6>
          <h5 className="pl-6">08/2022</h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer hover:text-red-500 transition-colors" />
        </div>
      </div>
    </div>
  )
}
const Address = () => {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState()
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [addressType, setAddressType] = useState("")
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!")
    } else {
      // dispatch(
      //   updatUserAddress(
      //     country,
      //     city,
      //     address1,
      //     address2,
      //     zipCode,
      //     addressType
      //   )
      // );
      setOpen(false)
      setCountry("")
      setCity("")
      setAddress1("")
      setAddress2("")
      setZipCode(null)
      setAddressType("")
    }
  }

  const handleDelete = (item) => {
    const id = item._id
    // dispatch(deleteUserAddress(id));
  }

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-[35%] h-[80vh] bg-white rounded-lg shadow-lg relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-semibold text-gray-800">Add New Address</h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full p-5">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2 focus:border-[#3a24db] focus:outline-none"
                    >
                      <option value="" className="block border pb-2">
                        choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Choose your City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2 focus:border-[#3a24db] focus:outline-none"
                    >
                      <option value="" className="block border pb-2">
                        choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input} border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2 w-[95%]`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input} border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2 w-[95%]`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input} border-2 focus:border-[#3a24db] focus:outline-none rounded-md p-2 w-[95%]`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 font-medium text-gray-700">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2 focus:border-[#3a24db] focus:outline-none"
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option className="block pb-2" key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer bg-[#3a24db] text-white hover:opacity-90 transition-all font-medium w-[95%]`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">My Addresses</h1>
        <div className={`${styles.button} !rounded-md hover:opacity-90 transition-all`} onClick={() => setOpen(true)}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow-md justify-between pr-10 mb-5 hover:bg-gray-50 transition-all"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">{user && user.phoneNumber}</h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px] text-gray-500">You not have any saved address!</h5>
      )}
    </div>
  )
}
export default ProfileContent
