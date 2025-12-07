import React, { useState } from 'react'
import { categories } from '../data'

function Form({ handleSubmit, name, setName }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [difficulty, setDifficulty] = useState("beginner");
    
    const categoryOptions = [
        <option key="default" value="" disabled>Select a category</option>,
        ...categories.map((category) => (
            <option key={category.value} value={category.value}>
                {category.label}
            </option>
        ))
    ];
    
    const isDisabled = selectedCategory === "";
    
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="input-group">
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    placeholder="Enter your name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="input-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select 
                name="difficulty" 
                id="difficulty" 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                required
            >
                <option value="beginner">Beginner (40 flips)</option>
                <option value="easy">Easy (30 flips)</option>
                <option value="medium">Medium (20 flips)</option>
                <option value="hard">Hard (15 flips)</option>
                <option value="insane">Insane (10 flips)</option>
            </select>
            </div>
            <div className="input-group">
            <label htmlFor="category">Category</label>
            <select 
                name="category" 
                id="category" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
            >
                {categoryOptions}
            </select>
            </div>
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