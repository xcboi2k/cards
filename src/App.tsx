import { Plus, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './App.css';
import './styles.css';
import PlayingCard from './components/PlayingCard';

type Card = {
  id: string
  isFlipped: boolean
  isNew: boolean
  isRemoving: boolean
  hasDealt: boolean 
}


function App() {
  const [cards, setCards] = useState<Card[]>([])
    const [selectedCardId, setSelectedCardId] =
        useState<string | null>(null)

        const dealCard = () => {
          setCards(prev => [
              {
                  id: crypto.randomUUID(),
                  isFlipped: false,
                  isNew: true,
                  isRemoving: false,
                  hasDealt: false,
              },
              ...prev, // 👈 NEW CARD GOES LEFT
          ])
      }

    const getTargetCard = (cards: Card[]) => {
        const targetId =
            selectedCardId ??
            cards[cards.length - 1]?.id

        return cards.find(c => c.id === targetId)
    }

    const targetCard = getTargetCard(cards)

    const isDealDisabled = cards.length === 5

    const isFlipFrontDisabled =
        !targetCard || targetCard.isFlipped

    const isFlipBackDisabled =
        !targetCard || !targetCard.isFlipped

    const isActionDisabled = !targetCard

    const flipFront = () => {
        setCards(prev => {
            const targetId =
                selectedCardId ??
                prev[prev.length - 1]?.id

            if (!targetId) return prev

            return prev.map(card =>
                card.id === targetId
                    ? { ...card, isFlipped: true }
                    : card
            )
        })
    }

    const flipBack = () => {
        setCards(prev => {
            const targetId =
                selectedCardId ??
                prev[prev.length - 1]?.id

            if (!targetId) return prev

            return prev.map(card =>
                card.id === targetId
                    ? { ...card, isFlipped: false }
                    : card
            )
        })
    }

    const slideOut = () => {
      setCards(prev => {
          if (!prev.length) return prev
  
          const rightMostId = prev[prev.length - 1].id
  
          return prev.map(card =>
              card.id === rightMostId
                  ? { ...card, isRemoving: true }
                  : card
          )
      })
  }

  const removeCard = (id: string) => {
    setCards(prev => {
        const rightMostId = prev[prev.length - 1]?.id

        if (id !== rightMostId) return prev

        return prev.filter(card => card.id !== id)
    })
}

    const markDealt = (id: string) => {
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, hasDealt: true }
                    : card
            )
        )
    }

    const selectCard = (id: string) => {
        setSelectedCardId(prev =>
            prev === id ? null : id
        )
    }

  return (
    <div className="container">
      <h1 className='header'>Card Deal and Flip Animation</h1>
            <div className="actions">
            <button className="btn btn-deal" onClick={dealCard} disabled={isDealDisabled}>
    <Plus size={16} /> Deal
</button>

<button
    className="btn btn-flip"
    onClick={flipFront}
    disabled={isFlipFrontDisabled}
>
    <RefreshCw size={16} /> Flip Front
</button>

<button
    className="btn btn-flip-back"
    onClick={flipBack}
    disabled={isFlipBackDisabled}
>
    <RotateCcw size={16} /> Flip Back
</button>

<button
    className="btn btn-danger"
    onClick={slideOut}
    disabled={isActionDisabled}
>
    <Trash2 size={16} /> Slide Out
</button>
            </div>
            <h2 className="table-title">Player Seat</h2>
            <div className="player-seat">
            
            {cards.length === 0 ? (
    <div className="empty-state">
        <h3>No cards yet</h3>
        <p>Click <b>Deal</b> to start the game</p>
        <p>Then use Flip or Slide Out buttons</p>
    </div>
) : (
    <div className="player-seat">
        {cards.map(card => (
            <PlayingCard
                key={card.id}
                card={card}
                selected={selectedCardId === card.id}
                onSelect={() => selectCard(card.id)}
                onMarkDealt={markDealt}
                onRemove={removeCard}
            />
        ))}
    </div>
)}
</div>
        </div>
  );
  }

export default App;
