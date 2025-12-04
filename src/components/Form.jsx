import React from 'react'
import { categories } from '../data'

function Form({ handleSubmit }) {

    const options = [<option value="" disabled selected>Select an option</option>]
    
    categories.forEach((category)=> (
        options.push(<option key={category.value} value={category.value}>{category.label}</option>)
    ))
  return (
    <form onSubmit={(e)=>handleSubmit(e)}>
        <select name="category" id="category">
            {options}
        </select>
        <button type="submit" className="form-button">Start Game</button>
    </form>
  )
}

export default Form