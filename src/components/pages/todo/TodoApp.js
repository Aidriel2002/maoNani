import React, { useState} from 'react';
import { auth, db } from '../../../firebase';
import {addDoc, collection } from 'firebase/firestore';
import './todoApp.css';
import '../auth/modal.css'

function TodoApp() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('low');


    const addTask = async () => {
        if (title.trim() === '' || description.trim() === '' || category.trim() === '' || priority.trim() === '') return;

        try {
            const timestamp = new Date();
            const userId = auth.currentUser.uid;
            const docRef = await addDoc(collection(db, 'tasks'), {
                userId: userId,
                title: title,
                description: description,
                category: category,
                priority: priority,
                completed: false,
                timestamp: timestamp.toISOString(),
            });
            console.log('Task added with ID: ', docRef.id);
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('low');
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    return (
        <>
            <div className='inputs'>
                <h3 className='icaption'>Add Task</h3>
                <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></input>
                <select
                    className='category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>Select category</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                </select>
                <select
                    className='priority'
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button className='abttn' onClick={addTask}>
                    Add Task
                </button>
            </div>
        </>
    );
}

export default TodoApp;
