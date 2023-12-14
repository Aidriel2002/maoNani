
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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
      <h2>Completed Tasks</h2>
      <div className="completed-tasks-list" id='completed-tasks-list'>
        {completedTasks.map((task) => (
          <div key={task.id} className="completed-task-item">
            <p>Title: {task.title}</p>
            <p>Description: {task.description}</p>
            <p>Category: {task.category}</p>
            <p>Priority Level: {task.priority}</p>
            <p>{new Date(task.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CompletedTasks;
