
function CardButton({ 
    content,
    handleClick,
    selectedCardEntry,
    emojiName,
    emojiIndex,
    matchedCardEntry }) {
   
        const btnContent = selectedCardEntry || matchedCardEntry ? <div className="back" aria-label={`Position: ${emojiIndex} - ${emojiName}`}>{content}</div> : <div aria-label={`Position: ${emojiIndex}`} className="front">?</div>

        
        const btnStyle =
            matchedCardEntry ? "btn--emoji__back--matched" :
            selectedCardEntry ? "btn--emoji__back--selected" :
            "btn--emoji__front"
     
        return (
            <button
                area-live="polite"
                
                className={`btn btn--emoji ${btnStyle}`}
                onClick={handleClick}
            >
                {btnContent}
            </button>
        )
}

export default CardButton