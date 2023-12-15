
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import './completedtask.css'

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const userId = auth.currentUser.uid;
        const completedTasksRef = collection(db, 'tasks');
        const querySnapshot = await getDocs(query(completedTasksRef, where('userId', '==', userId), where('completed', '==', true), orderBy('__name__')));

        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setCompletedTasks(tasksData);
      } catch (e) {
        console.error('Error fetching completed tasks: ', e);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCompletedTasks();
      } else {
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    <div className="bg">
      <h2>Completed Tasks</h2>
      <div className="task-list" id="tasks-list">
        {completedTasks.map((task) => (
          <div key={task.id} className={`completed-task-item ${task.recycleBin ? 'recycled' : 'restored'} ${task.completed ? 'completed' : 'notcomplete'
        } ${task.priority}`}>
            <p className='prio'>{task.priority}</p>
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Category: {task.category}</p>

            <p>{new Date(task.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      </div>
      
    </>
  );
}

export default CompletedTasks;
