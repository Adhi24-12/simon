const { useState, useCallback } = React;

    const STONE_COLORS = [
      '#266EF6', // Space
      '#E429F2', // Power
      '#FF8B00', // Soul
      '#FF0130', // Reality
      '#FFD300', // Mind
      '#12E772', // Time
      '#2C2A89', // Endgame cobalt
      '#5C49C6'  // Endgame iris
    ];

    const MAX_LEVEL = 6; 

    const SimonGame = () => {
      const [sequence, setSequence] = useState([]);
      const [playerSequence, setPlayerSequence] = useState([]);
      const [level, setLevel] = useState(1);
      const [isPlaying, setIsPlaying] = useState(false);
      const [gameStatus, setGameStatus] = useState('Press Start');
      const [activeColor, setActiveColor] = useState(null);
      const [showVictory, setShowVictory] = useState(false);

      const getRandomColor = () => Math.floor(Math.random() * STONE_COLORS.length);

      const playLastColor = useCallback((seq) => {
        if (!seq.length) return;
        const lastIndex = seq[seq.length - 1];
        setGameStatus('Watch carefully...');
        setActiveColor(lastIndex);
        setTimeout(() => {
          setActiveColor(null);
          setTimeout(() => setGameStatus('Your turn!'), 250);
        }, 650);
      }, []);

      const startGame = () => {
        const newSequence = [getRandomColor()];
        setSequence(newSequence);
        setPlayerSequence([]);
        setLevel(1);
        setIsPlaying(true);
        setShowVictory(false);
        setGameStatus('Watch carefully...');
        setTimeout(() => playLastColor(newSequence), 900);
      };

      const handleColorClick = (colorIndex) => {
        if (!isPlaying || gameStatus !== 'Your turn!') return;

        setActiveColor(colorIndex);
        setTimeout(() => setActiveColor(null), 260);

        const newPlayerSequence = [...playerSequence, colorIndex];
        setPlayerSequence(newPlayerSequence);

        if (sequence[newPlayerSequence.length - 1] !== colorIndex) {
          setGameStatus('Defeated by Ultron! Press Start.');
          setIsPlaying(false);
          return;
        }

        if (newPlayerSequence.length === sequence.length) {
       
          if (level >= MAX_LEVEL) { 
            setGameStatus('Avengers Assemble! Victory!');
            setIsPlaying(false);
            setShowVictory(true);
            return;
          }

          setGameStatus('Level up… recalibrating…');
          setTimeout(() => {
            const newLevel = level + 1;
            setLevel(newLevel);
            setPlayerSequence([]);
            const newSequence = [...sequence, getRandomColor()];
            setSequence(newSequence);
            setTimeout(() => playLastColor(newSequence), 900);
          }, 1200);
        }
      };

      return (
        <div className="game-container">
          <div className="avengers-badge">ETS</div>
          <h1>ENDGAME SIMON</h1>

          <div className="info-panel">
            <div className="level">Level: {level}/6</div> {/* <<< display /6 */} {/* [3] */}
            <div className="status">{gameStatus}</div>
          </div>

          <div className="simon-board">
            {STONE_COLORS.map((color, index) => (
              <button
                key={index}
                className={`color-button ${activeColor === index ? 'active' : ''}`}
                style={{
                  backgroundColor: color,
                  color,
                  gridColumn: `${(index % 4) + 1}`,
                  gridRow: `${Math.floor(index / 4) + 1}`
                }}
                onClick={() => handleColorClick(index)}
                disabled={!isPlaying || gameStatus !== 'Your turn!'}
                aria-label={`Stone ${index + 1}`}
              />
            ))}
          </div>

          <div className="controls">
            <button onClick={startGame} disabled={isPlaying}>
              {isPlaying ? 'Playing…' : 'Start Game'}
            </button>
          </div>

          <div className="instructions">
            <h3>How to Play</h3>
            <p>
              Only the newly added stone flashes each round. Repeat the full sequence to advance.
              Conquer level 6 to win. 
            </p>
          </div>

          {showVictory && (
            <div className="victory-message">
              <div className="cyber-text">AVENGERS ASSEMBLE</div>
              <div className="cyber-text">ACCESS GRANTED</div>
              <p style={{ color: '#B9BEBA', fontSize: '1.2rem', marginTop: '10px', textAlign: 'center', maxWidth: 520 }}>
                Earth’s Mightiest have acknowledged the mastery. A special SHIELD mission awaits. [2]
              </p>
              <a href="https://www.example.com/avengers-mission" className="hacker-link">
                Accept Your Mission
              </a>
              <button className="close-button" onClick={() => setShowVictory(false)}>
                Close
              </button>
            </div>
          )}
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<SimonGame />);