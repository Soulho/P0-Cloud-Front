import React from "react";

import "../styles/TaskColumn.css";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, icon, tasks, status, handleDelete, handleEdit }) => {
    return (
        <section className='task_column'>
            <h2 className='task_column_heading'>
                <img className='task_column_icon' src={icon} alt='' /> {title}
            </h2>

            {tasks.map(
                (task, index) =>
                    task.status === status && (
                        <TaskCard
                            key={task.id}
                            title={task.task} // Mostrar el nombre de la tarea
                            category={task.category}
                            dueDate={task.fechaFin}
                            handleDelete={handleDelete}
                            handleEdit={() => handleEdit(task)}
                            index={task.id}
                        />
                    )
            )}
        </section>
    );
};

export default TaskColumn;