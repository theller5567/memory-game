import CardButton from './CardButton'
import { decodeEntity } from 'html-entities'

export default function Cards({ data, handleClick, matchedEmojis, selectedEmojis}) {
    

    function cardElements(data){
        return data.map((emoji, index)=> {
            const selectedCardEntry = selectedEmojis.find(emoji => emoji.index === index)
            const matchedCardEntry = matchedEmojis.find(emoji => emoji.index === index)

            const cardStyle =
                matchedCardEntry ? "card-item--matched" :
                selectedCardEntry ? "card-item--selected" :
                ""
            return (
                <li key={index} className={`card-item ${cardStyle}`}>
                    <CardButton 
                        content={decodeEntity(emoji.htmlCode[0])}
                        handleClick={() => handleClick(emoji.name, index)}
                        selectedCardEntry={selectedCardEntry}
                        matchedCardEntry={matchedCardEntry}
                        emojiName={emoji.name}
                        emojiIndex={index +1}
                    />
                </li>
            )
        })
    }

    
    return (
        <ul className="card-container">
            {cardElements(data)}
        </ul>
    )
}