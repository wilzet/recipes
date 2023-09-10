'use client'
import { useState, useEffect } from 'react';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import '@/css/index.css';

const defaultWelcome = 'Please select a user';

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<UserUI | null>();
  const [welcomeMessage, setWelcomeMessage] = useState(defaultWelcome);
  const [leaderboard, setLeaderboard] = useState<UserUI[]>([]);

  useEffect(() => {
    const setUpLeaderboard = async () => {
      await fetchLeaderboard();
    };

    setUpLeaderboard();
  }, [])

  const fetchLeaderboard = async () => {
    const lBoard = await fetch('api/leaderboard')
      .then(res => res.json())
      .catch(e => console.log(e));

    if (lBoard.error) {
      setLeaderboard([]);
      return;
    }

    setLeaderboard(lBoard);
  }

  const fetchUser = async (username: string) => {
    await fetchLeaderboard();

    const user = leaderboard.find((element) => element.name === username);
    if (user) 
    {
      setWelcomeMessage(`Logged in as ${user.name}!`);
      setSelectedUser(user);
    }
  }

  const logOut = async () => {
    setWelcomeMessage(defaultWelcome);
    setSelectedUser(null);
    await fetchLeaderboard();
  }

  const makePost = async (amount: number) => {
    if (selectedUser && selectedUser.score + amount < 0) return;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score: amount })
    };
    const lBoard = await fetch(`api/leaderboard/${selectedUser?.name}`, options)
      .then(res => res.json())
      .catch(e => console.log(e));

    if (!lBoard.error) {
      if (selectedUser) selectedUser.score = lBoard.find((element: UserUI) => element.name === selectedUser.name).score;
      setLeaderboard(lBoard);
    }
  }

  const renderUser = (user: UserUI) => {
    if (selectedUser && selectedUser.name === user.name) {
      return (
        <tr key={user.name} style={{backgroundColor: '#2d2d3d'}}>
          <td>{user.name}</td>
          <td>{user.score}</td>
        </tr>
      );
    }
    return (
      <tr key={user.name}>
        <td>{user.name}</td>
        <td>{user.score}</td>
      </tr>
    );
  }

  return (
    <div className='main'>
      <h1>Our Recipes</h1>
      <h3>{welcomeMessage}</h3>
      <div className='containerH'>
        <div className='containerH left'>
          <Button
            value={process.env.NEXT_PUBLIC_USER_1}
            class={''}
            active={true}
            onClick={() => fetchUser(process.env.NEXT_PUBLIC_USER_1 as string)}
          />
        </div>
        <div className='center'>
          <Button
            value={process.env.NEXT_PUBLIC_USER_2}
            class={''}
            active={true}
            onClick={() => fetchUser(process.env.NEXT_PUBLIC_USER_2 as string)}
          />
        </div>
        <div className='containerH right'>
          <Button
            value={'Guest'}
            class={'buttonGreen'}
            active={true}
            onClick={() => fetchUser("Guest")}
          />
        </div>
      </div>
      <div className='containerH'>
        <Button
          value={'Log Out'}
          class={'buttonRed'}
          active={selectedUser ? true : false}
          onClick={logOut}
        />
      </div>
      {selectedUser && <div className='containerH'>
        <Button
          value={'+'}
          class={''}
          active={true}
          onClick={() => makePost(1)}
        />
        <Button
          value={'-'}
          class={''}
          active={true}
          onClick={() => makePost(-1)}
        />
      </div>}
      {leaderboard.length > 0 && <div className='containerV'>
        <h2>Leaderboard</h2>
        <table style={{fontSize: 'large'}}>
          <thead>
            <tr style={{backgroundColor: '#cccccc', color: '#2d2d3d'}}>
              <th>Name</th>
              <th>Contributions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user: UserUI) => (
              renderUser(user)
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
