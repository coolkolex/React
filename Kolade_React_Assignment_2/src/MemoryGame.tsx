import React, { useEffect, useState } from 'react';
import './MemoryGame.css';
import { shuffle } from 'lodash';

type MemoryGameProps = {
    images: string[];
};

type CardType = {
    id: number;
    image: string;
    isFlipped: boolean;
    isMatched: boolean;
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ images }) => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

    const resetGame = () => {
        const doubledImages = [...images, ...images];
        const shuffled = shuffle(doubledImages);
        const initializedCards: CardType[] = shuffled.map((img, idx) => ({
            id: idx,
            image: img,
            isFlipped: false,
            isMatched: false,
        }));
        setCards(initializedCards);
        setFlippedIndices([]);
    };

    useEffect(() => {
        resetGame();
    }, [images]);

    const handleCardClick = (index: number) => {
        const newCards = [...cards];
        if (newCards[index].isFlipped || newCards[index].isMatched || flippedIndices.length === 2) return;

        newCards[index].isFlipped = true;
        const newFlipped = [...flippedIndices, index];
        setCards(newCards);
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            const [firstIdx, secondIdx] = newFlipped;
            const firstCard = newCards[firstIdx];
            const secondCard = newCards[secondIdx];

            if (firstCard.image === secondCard.image) {
                newCards[firstIdx].isMatched = true;
                newCards[secondIdx].isMatched = true;
                setTimeout(() => {
                    setCards([...newCards]);
                    setFlippedIndices([]);
                }, 300);
            } else {
                setTimeout(() => {
                    newCards[firstIdx].isFlipped = false;
                    newCards[secondIdx].isFlipped = false;
                    setCards([...newCards]);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    return (
        <div>
            <div className="memory-game">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        {card.isFlipped || card.isMatched ? (
                            <img src={card.image} alt="card" />
                        ) : (
                            <div className="placeholder" />
                        )}
                    </div>
                ))}
                <div className='btn'>
                    <button className="reset-btn" onClick={resetGame}>Restart Game</button>
                </div>

            </div>
            <p id='last-p'>&copy; Kolade Duromola. 2025.</p>
        </div>
    );
};