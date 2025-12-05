import React, { useState } from 'react'
import { categories } from '../data'

function Form({ handleSubmit }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    

    const options = [
        <option key="default" value="" disabled>Select an option</option>,
        ...categories.map((category) => (
            <option key={category.value} value={category.value}>
                {category.label}
            </option>
        ))
    ];
    
    const isDisabled = selectedCategory === "";
    
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" name="name" id="name" placeholder="Enter your name" required />
            <label htmlFor="difficulty">Difficulty</label>
            {/* <select name="difficulty" id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                <option value="beginner">Beginner</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="insane">Insane</option>
            </select> */}
            <select 
                name="category" 
                id="category" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
            >
                {options}
            </select>
            <button 
                type="submit" 
                className="form-button" 
                disabled={isDisabled}
            >
                Start Game
            </button>
        </form>
    )
}

export default Form