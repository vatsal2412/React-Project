import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => 
{
  const navigate = useNavigate();

  return (
    <div className="home-screen">
      <h1>Let’s Play The Tic-Tac-Toe Game!</h1>
      <p>
        Choose a mode to play the game. First to make 3 in a row wins!
      </p>
      <button onClick={() => navigate('/game/computer')}>Play vs Computer</button>
      <button onClick={() => navigate('/game/2player')}>Play with a Friend</button>
    </div>
  );
};

export default Home;
