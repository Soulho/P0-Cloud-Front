import React from "react";

import "../styles/TaskCard.css";
import Tag from "./Tag";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit-icon.png"

const TaskCard = ({ title, tags, handleDelete, index, handleEdit }) => {
    return (
        <article className='task_card'>
            <p className='task_text'>{title}</p>

            <div className='task_card_bottom_line'>
                <div className='task_card_tags'>
                    {tags.map((tag, index) => (
                        <Tag key={index} tagName={tag} selected />
                    ))}
                </div>
                <div
                    className='task_delete'
                    onClick={() => handleDelete(index)}>
                    <img src={deleteIcon} className='delete_icon' alt='' />
                </div>
                <div className="task_edit" onClick={() => handleEdit(index)}>
                    <img src={editIcon} className="edit_icon" alt="Edit" />
                </div>
            </div>
        </article>
    );
};

export default TaskCard;