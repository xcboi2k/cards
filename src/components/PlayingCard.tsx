import { Card } from './CardTypes'

type Props = {
    card: Card
    selected: boolean
    onSelect: () => void
    onMarkDealt: (id: string) => void
    onRemove: (id: any) => void
}

export default function PlayingCard({
    card,
    selected,
    onSelect,
    onMarkDealt,
    onRemove,
}: Props) {
    return (
        <div className="card-stack">
            <div
                className={`card-wrapper ${
                    !card.hasDealt
                        ? 'deal-animation'
                        : card.isRemoving
                        ? 'slide-out'
                        : ''
                }`}
                onClick={onSelect}
                onAnimationEnd={() => {
                    if (!card.hasDealt) {
                        onMarkDealt(card.id)
                        return
                    }

                    if (card.isRemoving) {
                        onRemove(card.id)
                    }
                }}
            >
                <div
                    className={`card-inner ${
                        card.isFlipped ? 'flipped' : ''
                    }`}
                >
                    <div className="card-face card-front">
                        A♠
                    </div>

                    <div className="card-face card-back">
                        BACK
                    </div>
                </div>
            </div>

            {selected && (
                <div className="selected-label">
                    <span className="arrow">▼</span>
                    <span className="text">Latest Selected</span>
                </div>
            )}
        </div>
    )
}