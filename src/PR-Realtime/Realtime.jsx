import React, { useEffect } from 'react'
import './firebase'
import { endAt, get, onValue, orderByChild, push, query, ref, remove, set, startAt, update } from 'firebase/database'
import { getDatabase } from "firebase/database"
const Realtime = () => {
    const db = getDatabase()
    // const dbf = ref(db);

    useEffect(() => {
        const userRef = ref(db, "Users")
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data found");
            }
        }).catch((error) => {
            console.error("Error getting data:", error);
        });
    }, [])

 

    const checkValidation = (input) => {
        const errors = {}

        if (input.name.trim() === "") {
            errors.name = "Invalid Name*"
        }
        if (input.position.trim() === "") {
            errors.position = "Invalid Input*"
        }
        if (input.department.trim() === "") {
            errors.department = "Invalid Data*"
        }

        return errors
    }

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const validate = checkValidation(input)
        setErrors(validate)
        const check = Object.keys(validate)
        if (check.length < 1) {
            // setEmps([...emps, input])
            if (editMode && id) {
                const userRef = ref(db, `Employees/${id}`)
                update(userRef, input).then()
                setEditMode(false)
                navigate(-1)
                setInput(init)
            } else {
                const userRef = ref(db, "Employees")
                const newRef = push(userRef)
                set(newRef, input).then(() => {
                    setEmployees(...employees, input)
                    navigate(-1)
                    setInput(init)
                })
            }
        }
    }
    // console.log(emps);



    return (
        <section className='mt-5 gr-text'>
            <div className="container">
                <div className="col-4 m-auto">
                    <form action="" className='bg-light p-3 bor-rad lightslategrey shadow-lg' onSubmit={handleSubmit}>
                        <h4 className='text-center mb-3'>{editMode ? "Update Employee" : "New Employee"}</h4>
                        <div className="form-group mb-3">
                            <input type="text" placeholder="" name='name' value={input ? input.name : ''} onChange={handleChange}></input>
                            <label>Name</label>
                            <div className='text-danger text-end'>{errors.name}</div>
                        </div>
                        <div className="form-group mt-3 mb-3">
                            <input type="text" placeholder="" name='position' value={input ? input.position : ''} onChange={handleChange}></input>
                            <label>Positions</label>
                            <div className='text-danger text-end'>{errors.position}</div>
                        </div>
                        <select className='bor-rad w-100 pyy-2' name='department' onChange={handleChange} value={input ? input.department : ''}>
                            <option value="" className='pyy-2 bor-rad'>--Department--</option>
                            <option value="Human Resources" className='pyy-2 bor-rad'>Human Resources</option>
                            <option value="Finance and Accounting" className='pyy-2 bor-rad'>Finance and Accounting</option>
                            <option value="Sales and Marketing" className='pyy-2 bor-rad'>Sales and Marketing</option>
                            <option value="Information Technology (IT)" className='pyy-2 bor-rad'>Information Technology (IT)</option>
                            <option value="Customer Support" className='pyy-2 bor-rad'>Customer Support</option>
                            <option value="Production" className='pyy-2 bor-rad'>Production</option>
                            <option value="Quality Control" className='pyy-2 bor-rad'>Quality Control</option>
                            <option value="Project Management" className='pyy-2 bor-rad'>Project Management</option>
                            <option value="Business Development" className='pyy-2 bor-rad'>Business Development</option>
                        </select>
                        <div className='text-danger text-end'>{errors.department}</div>
                        <button type='submit' className='button w-100 py-2 mt-3'>{editMode ? "Update" : "Add"}</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Realtime