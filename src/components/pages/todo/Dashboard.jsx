import TaskList from "./TaskList";
import TodoApp from "./TodoApp";
import './todoApp.css'

export default function Dashboard({ user }) {
    return (
      <>
      <div className="body">
        <div className="welcome">
          <p className='greet'>Welcome <span>{user.displayName}</span>!   </p>
          <p className='question'> What's your plan for today?</p>
        </div>
        <div className="todo">
        <TodoApp/>
        </div>
        </div>
        < TaskList />
      </>
    );
  }