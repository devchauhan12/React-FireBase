import React, { useEffect, useState } from 'react'
import './firebase'
import { endAt, get, onValue, orderByChild, push, query, ref, remove, set, startAt, update } from 'firebase/database'
import { getDatabase } from "firebase/database"
import { useNavigate } from 'react-router-dom'
const Realtime = () => {
    const db = getDatabase();
    const initial = {
        name: '',
        email: '',
        status: '',
    }
    const [input, setInput] = useState(initial)
    const [errors, setErrors] = useState({})
    const [Users, setUsers] = useState()
    const [state, setState] = useState(true)
    const [updateID, setId] = useState(true)
    const [sortOrder, setSortOrder] = useState('asc')
    const categories = ['All', 'Active', 'Away', 'Not Active'];
    const [list, setList] = useState(Users)

    const handleSearch = (e) => {
        let name = e.target.value
        console.log('first')
        let search = Users.filter(item =>
            item.name.toLowerCase().includes(name.toLowerCase())
        )
        setList(search)
    }

    const handleFilter = (e) => {
        let name = e.target.value
        let search = Users.filter((item) => {
            return name === 'All' ? true : item.status === name
        })
        setList(search)
    }

    useEffect(() => {
        const userRef = ref(db, "Users")
        onValue(userRef, (snapshot) => {
            var list = []
            snapshot.forEach((snapchild) => {
                var id = snapchild.key
                var data = snapchild.val()
                var details = { id, ...data }
                list.push(details)
            })
            setUsers(list)
            setList(list)
        })
    }, [])


    function validate() {
        let error = {}
        if (input.name.length < 1) {
            error.name = 'Enter Your Name'
        }
        if (input.email.length < 1) {
            error.email = 'Enter Your Email'
        }
        if (input.status === '') {
            error.status = 'Select the Status'
        }
        return error;
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        const checkErrors = validate()

        if (Object.keys(checkErrors).length > 0) {
            setErrors(checkErrors)
        } else {
            const userRef = ref(db, 'Users');
            const newRef = push(userRef);
            set(newRef, input)
            setErrors({})
            setInput(initial)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    const handleDelete = (id) => {
        const userRef = ref(db, `Users/${id}`);
        remove(userRef)
    };
    const editData = (id) => {
        if (state) {
            setState(false)
            const userRef = ref(db, `Users/${id}`);
            get(userRef).then((snapshot) => {
                setId(id)
                setInput(snapshot.val());
            })
        } else {
            const userRef = ref(db, `Users/${updateID}`);
            update(userRef, input)
            setState(true)
            setInput(initial)
        }
    };
    const handleSort = () => {
        const orderType = sortOrder === 'asc' ? 'desc' : 'asc';
        let sort1 = Users.sort((a, b) => {
            if (orderType === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setSortOrder(orderType)
        setList(sort1)
    }


    return (
        <>
            <div className="container mt-5">
                <div className="form-box m-auto">
                    <form className="form" onSubmit={(e) => e.preventDefault()}>
                        <span className="title">Add User</span>
                        <div className="form-container">
                            <input type="text" name='name' placeholder="Name" value={input.name} onChange={handleChange} />
                            {errors.name ? <p>{errors.name}</p> : null}
                            <input type="email" name='email' placeholder="Email" value={input.email} onChange={handleChange} />
                            {errors.email ? <p>{errors.email}</p> : null}
                            <select name="status" className='w-100 p-2 text-secondary' value={input.status} onChange={handleChange} style={{ border: 'none', outline: 'none' }} id="">
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Away">Away</option>
                                <option value="Not Active">Not Active</option>
                            </select>
                            {errors.status ? <p>{errors.status}</p> : null}
                        </div>
                        <button onClick={handleAdd} style={{ display: !state ? 'none' : 'block' }}>Add User</button>
                        <button onClick={editData} style={{ display: state ? 'none' : 'block' }}>Update</button>
                    </form>
                </div >
                <div className="Header bg-dark d-flex flex-column m-5 rounded-3">
                    <div className='d-flex justify-content-around align-items-center p-3'>
                        <div>
                            <label className='text-white'>
                                Filter by Category:
                                <select key={'xyz'} className='ms-3 rounded bg-secondary text-white' onChange={handleFilter}>
                                    {categories.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="input me-2">
                            <input type="text" autoComplete="off" key={'input'} className='text-white' placeholder='Name' onChange={handleSearch} />
                        </div>
                        <div className='d-flex align-items-center rounded-4 me-2 text-white p-2'>
                            <button className='btn px-4 py-6 fs-6 border-primary border-4 text-white' onClick={handleSort}>
                                Sort {sortOrder === 'asc' ? <i className="ms-2 fa-regular fa-circle-up"></i> : <i className="ms-2 fa-regular fa-circle-down"></i>}
                            </button>
                        </div>
                    </div>
                    <table className="table table-hover table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td style={{ color: item.status === 'Active' ? 'lightgreen' : item.status === 'Away' ? '#FFB534' : 'red' }} >{item.status}</td>
                                        <td>
                                            <button className='btn btn-info me-2' onClick={() => editData(item.id)} disabled={!state}>Edit</button>
                                            <button className='btn btn-danger' onClick={() => handleDelete(item.id)} disabled={!state}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    )
}

export default Realtime