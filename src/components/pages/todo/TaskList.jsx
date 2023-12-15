import { doc, query, getDocs, getDoc, updateDoc, collection, setDoc, where, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

import { auth, db } from '../../../firebase';
import './TaskList.css'

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editPriority, setEditPriority] = useState('');


    const markComplete = async (taskId) => {
        try {
            const taskDocRef = doc(db, 'tasks', taskId);
            await updateDoc(taskDocRef, { completed: true });

            setTasks((prevTasks) =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, completed: true } : task
                )

            );
        } catch (e) {
            console.error('Error marking task as complete: ', e);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = auth.currentUser.uid;
                const tasksRef = collection(db, 'tasks');
                const querySnapshot = await getDocs(query(tasksRef, where('userId', '==', userId), orderBy('__name__')));

                const tasksData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTasks(tasksData);
            } catch (e) {
                console.error('Error fetching tasks: ', e);
            }

        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchTasks();
            } else {
            }
        });

        return () => unsubscribe();
    }, []);


    const moveTask = (taskId) => {
        setSelectedTask(taskId);
        setShowConfirmationModal(true);
    };

    const closeConfirmationModal = () => {
        setSelectedTask(null);
        setShowConfirmationModal(false);
    };

    const confirmMoveTask = async () => {
        try {
            if (!selectedTask) return;

            const taskDocRef = doc(db, 'tasks', selectedTask);
            const taskSnapshot = await getDoc(taskDocRef);

            if (taskSnapshot.exists()) {
                const taskData = taskSnapshot.data();
                const timestamp = new Date();

                await setDoc(doc(db, 'recycleBin', selectedTask), { ...taskData, timestamp: timestamp.toISOString() });
                await updateDoc(taskDocRef, { recycleBin: true });

                setTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTask));
            }

            closeConfirmationModal();
        } catch (e) {
            console.error('Error moving task: ', e);
        }
    };

    const startEditing = (task) => {
        setIsEditing(true);
        setSelectedTask(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditCategory(task.category);
        setEditPriority(task.priority);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setSelectedTask(null);
        setEditTitle('');
        setEditDescription('');
        setEditCategory('');
        setEditPriority('');
    };

    const saveEditing = async () => {
        try {
            if (!selectedTask) return;

            const taskDocRef = doc(db, 'tasks', selectedTask);
            await updateDoc(taskDocRef, {
                title: editTitle,
                description: editDescription,
                category: editCategory,
                priority: editPriority,
            });

            setTasks((prevTasks) =>
                prevTasks.map(task =>
                    task.id === selectedTask
                        ? {
                            ...task,
                            title: editTitle,
                            description: editDescription,
                            category: editCategory,
                            priority: editPriority,
                        }
                        : task
                )
            );

            cancelEditing();
        } catch (e) {
            console.error('Error updating task: ', e);
        }
    };

    return (
        <>
        <div className="bg">

            <div className="task-list" id="tasks-list" >
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`task-item ${task.recycleBin ? 'recycled' : 'restored'} ${task.completed ? 'completed' : 'notcomplete'
                            } ${task.priority}`}
                    >
                        <p className='prio'>{task.priority}</p>
                        <p>Title: {task.title}</p>
                        <p>Description: {task.description}</p>
                        <p>Category: {task.category}</p>

                        <button className='del' onClick={() => moveTask(task.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>

                        <button className='edit' onClick={() => startEditing(task)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>

                        {!task.completed &&
                            <button className='done' onClick={() => markComplete(task.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        }
                        <p className="dtime"> {new Date(task.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            {showConfirmationModal && (
                <div className="modal-overlayt" onClick={closeConfirmationModal}>
                    <div className="modal-contentt" onClick={(e) => e.stopPropagation()}>
                        <p>Move task to Recycle Bin?</p>
                        <button onClick={confirmMoveTask}>Yes</button>
                        <button onClick={closeConfirmationModal}>No</button>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="modal-overlayt" onClick={cancelEditing}>
                    <div className="modal-contentt" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Task</h3>
                        
                        <input className='einput' type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        
                        <input className='einput' type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                        
                        <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </select>
                        
                        <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button onClick={saveEditing}>Save</button>
                        <button onClick={cancelEditing}>Cancel</button>
                    </div>
                </div>
            )}
            </div>

        </>
    )
}

export default TaskList