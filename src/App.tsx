import {
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
} from 'lucide-react'

import { useState } from 'react'
import './App.css'
import './styles.css'
import PlayingCard from './components/PlayingCard'

type Card = {
  id: string
  isFlipped: boolean
  isNew: boolean
  isRemoving: boolean
  hasDealt: boolean
}

const TOTAL_SLOTS = 5

function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCardId, setSelectedCardId] =
      useState<string | null>(null)

  // 🃏 DEAL (LEFT → RIGHT fill)
  const dealCard = () => {
      if (cards.length >= TOTAL_SLOTS) return

      setCards(prev => [
          {
              id: crypto.randomUUID(),
              isFlipped: false,
              isNew: true,
              isRemoving: false,
              hasDealt: false,
          },
          ...prev,
      ])
  }

  // 🎯 get selected / last card
  const getTargetCard = (cards: Card[]) => {
      const targetId =
          selectedCardId ??
          cards[cards.length - 1]?.id

      return cards.find(c => c.id === targetId)
  }

  const targetCard = getTargetCard(cards)

  const isDealDisabled =
      cards.length === TOTAL_SLOTS

  const isFlipFrontDisabled =
      !targetCard || targetCard.isFlipped

  const isFlipBackDisabled =
      !targetCard || !targetCard.isFlipped

  const isActionDisabled = !targetCard

  // 🔄 FLIP FRONT
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

  // 🔄 FLIP BACK
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

  // 🗑 slide OUT RIGHTMOST
  const slideOut = () => {
      setCards(prev => {
          if (!prev.length) return prev

          const rightMostId = prev.at(-1)?.id

          return prev.map(card =>
              card.id === rightMostId
                  ? { ...card, isRemoving: true }
                  : card
          )
      })
  }

  // ❌ remove after animation
  const removeCard = (id: string) => {
      setCards(prev =>
          prev.filter(card => card.id !== id)
      )
  }

  // 🟡 mark dealt finished
  const markDealt = (id: string) => {
      setCards(prev =>
          prev.map(card =>
              card.id === id
                  ? { ...card, hasDealt: true }
                  : card
          )
      )
  }

  // 🎯 select toggle
  const selectCard = (id: string) => {
      setSelectedCardId(prev =>
          prev === id ? null : id
      )
  }

  // 🧩 SLOT SYSTEM (5 fixed positions)
  const slots = Array.from(
      { length: TOTAL_SLOTS },
      (_, i) => cards[i] ?? null
  )

  return (
      <div className="container">
          <h1 className="header">
              Card Deal and Flip Animation
          </h1>

          {/* ACTIONS */}
          <div className="actions">
              <button
                  className="btn btn-deal"
                  onClick={dealCard}
                  disabled={isDealDisabled}
              >
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

          <h2 className="table-title">
              Player Seat
          </h2>

          {/* EMPTY STATE */}
          {cards.length === 0 ? (
              <div className="empty-state">
                  <h3>No cards yet</h3>
                  <p>
                      Click <b>Deal</b> to start the game
                  </p>
                  <p>
                      Then use Flip or Slide Out
                  </p>
              </div>
          ) : (
              <div className="player-seat">
                  {slots.map((card, index) =>
                      card ? (
                          <PlayingCard
                              key={card.id}
                              card={card}
                              selected={
                                  selectedCardId ===
                                  card.id
                              }
                              onSelect={() =>
                                  selectCard(card.id)
                              }
                              onMarkDealt={markDealt}
                              onRemove={removeCard}
                          />
                      ) : (
                          <div
                              key={index}
                              className="card-slot"
                          >
                              <div className="dotted-card">
                                  Empty
                              </div>
                          </div>
                      )
                  )}
              </div>
          )}
      </div>
  )
}

export default App