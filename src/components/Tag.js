import React from "react";

import "../styles/Tag.css";

const Tag = ({ tagName, selectTag, selected }) => {
    const tagStyle = {
        Estudio: { backgroundColor: "#fda821" },
        Trabajo: { backgroundColor: "#15d4c8" },
        Ejercicio: { backgroundColor: "#ffd12c" },
        Meditacion: { backgroundColor: "#4cdafc" },
        default: { backgroundColor: "#f9f9f9" },
    };
    return (
        <button
            type="button"
            className="tag"
            style={selected ? tagStyle[tagName] || tagStyle.default : tagStyle.default}
            onClick={() => selectTag && selectTag(tagName)}>
            {tagName}
        </button>
    );
};

export default Tag;